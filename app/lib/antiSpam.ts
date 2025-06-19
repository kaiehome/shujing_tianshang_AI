interface SpamRecord {
  ip?: string
  deviceId: string
  deviceFingerprint?: string // 新增：设备指纹
  prompts: string[]
  timestamps: number[]
  lastGenerationTime: number
  lockoutUntil?: number // 新增：锁定截止时间
  suspiciousScore?: number // 新增：可疑行为评分
}

const SPAM_STORAGE_KEY = 'anti_spam_records'
const MAX_DUPLICATE_PROMPTS = 3 // 最多允许3次相同的提示词
const MIN_GENERATION_INTERVAL = 5000 // 最小生成间隔5秒
const RATE_LIMIT_WINDOW = 60000 // 1分钟窗口期
const MAX_GENERATIONS_PER_MINUTE = 5 // 每分钟最多5次生成

// 新增：更严格的防刷参数
const DEVICE_FINGERPRINT_KEYS = [
  'screen.width', 'screen.height', 'navigator.language',
  'navigator.platform', 'navigator.userAgent'
] // 设备指纹特征
const MAX_DEVICES_PER_SESSION = 2 // 单次会话最多允许2个设备
const SUSPICIOUS_BEHAVIOR_THRESHOLD = 0.8 // 可疑行为阈值
const LOCKOUT_DURATION = 30 * 60 * 1000 // 锁定时长30分钟

// 安全的字符串处理函数
function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'string') {
        // 确保字符串只包含安全字符
        return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, '');
      }
      return value;
    });
  } catch (error) {
    console.error('Stringify error:', error);
    return '{}';
  }
}

function safeParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

function safeEncodeForStorage(data: any): string {
  try {
    const jsonString = safeStringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Encode error:', error);
    return '';
  }
}

function safeDecodeFromStorage(encodedData: string): any {
  try {
    const decodedData = decodeURIComponent(atob(encodedData));
    return safeParse(decodedData);
  } catch (error) {
    console.error('Decode error:', error);
    return null;
  }
}

// 新增：生成设备指纹
function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server'
  
  try {
    const features = [
      window.screen.width,
      window.screen.height,
      window.navigator.language,
      window.navigator.platform,
      window.navigator.userAgent.substring(0, 100), // 截取部分UA避免过长
      window.devicePixelRatio,
      new Date().getTimezoneOffset()
    ]
    
    // 简单哈希生成指纹
    const fingerprint = features.join('|')
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转为32位整数
    }
    return Math.abs(hash).toString(36)
  } catch (error) {
    console.warn('设备指纹生成失败:', error)
    return 'unknown'
  }
}

export class AntiSpamService {
  private static instance: AntiSpamService
  private records: Map<string, SpamRecord> = new Map()

  static getInstance(): AntiSpamService {
    if (!AntiSpamService.instance) {
      AntiSpamService.instance = new AntiSpamService()
    }
    return AntiSpamService.instance
  }

  constructor() {
    this.loadRecords()
  }

  private loadRecords() {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(SPAM_STORAGE_KEY)
      if (stored) {
        // 尝试新格式（安全编码）
        const data = safeDecodeFromStorage(stored)
        if (data) {
          this.records = new Map(Object.entries(data))
          return
        }
        
        // 尝试旧格式（直接JSON）
        const oldData = safeParse(stored)
        if (oldData) {
          this.records = new Map(Object.entries(oldData))
          return
        }
        
        // 如果都失败，重置记录
        console.warn('无法加载防刷记录，将重置数据')
        this.records = new Map()
      }
    } catch (error) {
      console.error('加载防刷记录失败:', error)
      this.records = new Map()
    }
  }

  private saveRecords() {
    if (typeof window === 'undefined') return
    
    try {
      const data = Object.fromEntries(this.records)
      const encodedData = safeEncodeForStorage(data)
      if (encodedData) {
        localStorage.setItem(SPAM_STORAGE_KEY, encodedData)
      }
    } catch (error) {
      console.error('保存防刷记录失败:', error)
    }
  }

  /**
   * 检查是否可以生成图像
   */
  canGenerate(deviceId: string, prompt: string): {
    allowed: boolean
    reason?: string
    waitTime?: number
  } {
    const record = this.records.get(deviceId) || {
      deviceId,
      prompts: [],
      timestamps: [],
      lastGenerationTime: 0,
      deviceFingerprint: generateDeviceFingerprint(),
      suspiciousScore: 0
    }

    const now = Date.now()
    const trimmedPrompt = prompt.trim().toLowerCase()

    // 新增：检查设备锁定状态
    if (record.lockoutUntil && now < record.lockoutUntil) {
      const remainingTime = record.lockoutUntil - now
      return {
        allowed: false,
        reason: '账户已被暂时锁定，请稍后再试',
        waitTime: remainingTime
      }
    }

    // 新增：设备指纹验证
    const currentFingerprint = generateDeviceFingerprint()
    if (record.deviceFingerprint && record.deviceFingerprint !== currentFingerprint) {
      // 设备指纹不匹配，可能是绕过行为
      record.suspiciousScore = (record.suspiciousScore || 0) + 0.3
      
      if (record.suspiciousScore >= SUSPICIOUS_BEHAVIOR_THRESHOLD) {
        record.lockoutUntil = now + LOCKOUT_DURATION
        this.records.set(deviceId, record)
        this.saveRecords()
        
        return {
          allowed: false,
          reason: '检测到异常行为，账户已被暂时锁定',
          waitTime: LOCKOUT_DURATION
        }
      }
    }

    // 检查生成间隔
    if (now - record.lastGenerationTime < MIN_GENERATION_INTERVAL) {
      return {
        allowed: false,
        reason: '生成太频繁，请稍后再试',
        waitTime: MIN_GENERATION_INTERVAL - (now - record.lastGenerationTime)
      }
    }

    // 检查速率限制
    const recentTimestamps = record.timestamps.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    )
    
    if (recentTimestamps.length >= MAX_GENERATIONS_PER_MINUTE) {
      // 新增：频繁生成增加可疑评分
      record.suspiciousScore = (record.suspiciousScore || 0) + 0.2
      
      return {
        allowed: false,
        reason: '生成频率过高，请1分钟后再试',
        waitTime: RATE_LIMIT_WINDOW - (now - recentTimestamps[0])
      }
    }

    // 检查重复提示词
    const duplicateCount = record.prompts.filter(p => p === trimmedPrompt).length
    if (duplicateCount >= MAX_DUPLICATE_PROMPTS) {
      // 新增：重复提示词增加可疑评分
      record.suspiciousScore = (record.suspiciousScore || 0) + 0.1
      
      return {
        allowed: false,
        reason: '相同提示词使用次数过多，请尝试不同的描述'
      }
    }

    // 新增：检查可疑模式
    if (this.detectSuspiciousPatterns(record, trimmedPrompt)) {
      record.suspiciousScore = (record.suspiciousScore || 0) + 0.2
      
      if (record.suspiciousScore >= SUSPICIOUS_BEHAVIOR_THRESHOLD) {
        record.lockoutUntil = now + LOCKOUT_DURATION
        this.records.set(deviceId, record)
        this.saveRecords()
        
        return {
          allowed: false,
          reason: '检测到可疑使用模式，账户已被暂时锁定',
          waitTime: LOCKOUT_DURATION
        }
      }
    }

    return { allowed: true }
  }

  /**
   * 记录生成行为
   */
  recordGeneration(deviceId: string, prompt: string) {
    const record = this.records.get(deviceId) || {
      deviceId,
      prompts: [],
      timestamps: [],
      lastGenerationTime: 0,
      deviceFingerprint: generateDeviceFingerprint(),
      suspiciousScore: 0
    }

    const now = Date.now()
    const trimmedPrompt = prompt.trim().toLowerCase()

    // 添加新记录
    record.prompts.push(trimmedPrompt)
    record.timestamps.push(now)
    record.lastGenerationTime = now

    // 更新设备指纹（如果未设置）
    if (!record.deviceFingerprint) {
      record.deviceFingerprint = generateDeviceFingerprint()
    }

    // 降低可疑评分（正常使用会逐渐降低评分）
    if (record.suspiciousScore && record.suspiciousScore > 0) {
      record.suspiciousScore = Math.max(0, record.suspiciousScore - 0.05)
    }

    // 清理过期数据，只保留24小时内的记录
    const dayAgo = now - 24 * 60 * 60 * 1000
    record.prompts = record.prompts.slice(-50) // 只保留最近50个提示词
    record.timestamps = record.timestamps.filter(timestamp => timestamp > dayAgo)

    // 清理过期的锁定状态
    if (record.lockoutUntil && now > record.lockoutUntil) {
      delete record.lockoutUntil
      record.suspiciousScore = 0 // 锁定过期后重置可疑评分
    }

    this.records.set(deviceId, record)
    this.saveRecords()
  }

  /**
   * 检查是否为可疑行为
   */
  isSuspiciousBehavior(deviceId: string): boolean {
    const record = this.records.get(deviceId)
    if (!record) return false

    const now = Date.now()
    const recentTimestamps = record.timestamps.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    )

    // 检查短时间内大量生成
    if (recentTimestamps.length > MAX_GENERATIONS_PER_MINUTE * 2) {
      return true
    }

    // 检查重复提示词比例
    const uniquePrompts = new Set(record.prompts)
    const duplicateRatio = 1 - uniquePrompts.size / record.prompts.length
    if (record.prompts.length > 10 && duplicateRatio > 0.7) {
      return true
    }

    return false
  }

  /**
   * 重置设备记录（用于解除限制）
   */
  resetDevice(deviceId: string) {
    this.records.delete(deviceId)
    this.saveRecords()
  }

  /**
   * 获取设备统计信息
   */
  getDeviceStats(deviceId: string) {
    const record = this.records.get(deviceId)
    if (!record) {
      return {
        totalGenerations: 0,
        todayGenerations: 0,
        uniquePrompts: 0,
        isSuspicious: false
      }
    }

    const now = Date.now()
    const todayStart = new Date().setHours(0, 0, 0, 0)
    const todayGenerations = record.timestamps.filter(
      timestamp => timestamp >= todayStart
    ).length

    return {
      totalGenerations: record.timestamps.length,
      todayGenerations,
      uniquePrompts: new Set(record.prompts).size,
      isSuspicious: this.isSuspiciousBehavior(deviceId)
    }
  }

  /**
   * 清除所有防刷数据（用于调试和解决存储问题）
   */
  clearAllData() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(SPAM_STORAGE_KEY)
      this.records = new Map()
      console.log('已清除所有防刷数据')
    } catch (error) {
      console.error('清除防刷数据失败:', error)
    }
  }

  /**
   * 检测可疑使用模式
   */
  private detectSuspiciousPatterns(record: SpamRecord, currentPrompt: string): boolean {
    const now = Date.now()
    
    // 模式1：短时间内多次生成
    const last5Minutes = record.timestamps.filter(
      timestamp => now - timestamp < 5 * 60 * 1000
    )
    if (last5Minutes.length > 8) return true
    
    // 模式2：提示词过于简单或重复性高
    const shortPrompts = record.prompts.filter(p => p.length < 3).length
    if (shortPrompts > record.prompts.length * 0.6) return true
    
    // 模式3：使用自动化工具的特征
    if (this.detectAutomationPatterns(record.prompts)) return true
    
    // 模式4：连续相似的时间间隔（可能是脚本）
    if (this.detectRegularIntervals(record.timestamps)) return true
    
    return false
  }

  /**
   * 检测自动化工具特征
   */
  private detectAutomationPatterns(prompts: string[]): boolean {
    if (prompts.length < 5) return false
    
    // 检查是否有过多相同的提示词
    const uniquePrompts = new Set(prompts)
    const duplicateRatio = 1 - uniquePrompts.size / prompts.length
    if (duplicateRatio > 0.8) return true
    
    // 检查是否有明显的序列模式（如test1, test2, test3）
    const sequencePattern = /^(test|生成|图片|测试)\d*$/i
    const sequenceCount = prompts.filter(p => sequencePattern.test(p)).length
    if (sequenceCount > prompts.length * 0.5) return true
    
    return false
  }

  /**
   * 检测规律性时间间隔
   */
  private detectRegularIntervals(timestamps: number[]): boolean {
    if (timestamps.length < 5) return false
    
    const intervals = []
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1])
    }
    
    // 检查间隔的标准差，过小说明可能是自动化
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((acc, interval) => {
      return acc + Math.pow(interval - avgInterval, 2)
    }, 0) / intervals.length
    const stdDev = Math.sqrt(variance)
    
    // 如果标准差很小且平均间隔在5-10秒之间，可能是自动化
    return stdDev < 1000 && avgInterval > 5000 && avgInterval < 10000
  }
} 