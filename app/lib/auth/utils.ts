import { validationRules, errorMessages } from './config'
import { AuthError } from './types'
import crypto from 'crypto'

// 生成随机验证码
export function generateSmsCode(length: number = 6): string {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

// 生成随机字符串
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

// 生成随机状态值用于OAuth
export function generateOAuthState(): string {
  return crypto.randomBytes(16).toString('hex')
}

// 手机号验证
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: '手机号不能为空' }
  }
  
  if (!validationRules.phone.test(phone)) {
    return { isValid: false, error: errorMessages.INVALID_PHONE }
  }
  
  return { isValid: true }
}

// 邮箱验证
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: '邮箱不能为空' }
  }
  
  if (!validationRules.email.test(email)) {
    return { isValid: false, error: '邮箱格式不正确' }
  }
  
  return { isValid: true }
}

// 验证码验证
export function validateSmsCode(code: string): { isValid: boolean; error?: string } {
  if (!code) {
    return { isValid: false, error: '验证码不能为空' }
  }
  
  if (!validationRules.smsCode.test(code)) {
    return { isValid: false, error: '验证码格式不正确' }
  }
  
  return { isValid: true }
}

// 昵称验证
export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  if (!nickname) {
    return { isValid: false, error: '昵称不能为空' }
  }
  
  if (nickname.length < validationRules.nickname.minLength) {
    return { isValid: false, error: `昵称至少需要${validationRules.nickname.minLength}个字符` }
  }
  
  if (nickname.length > validationRules.nickname.maxLength) {
    return { isValid: false, error: `昵称不能超过${validationRules.nickname.maxLength}个字符` }
  }
  
  if (!validationRules.nickname.pattern.test(nickname)) {
    return { isValid: false, error: '昵称只能包含中文、英文、数字、下划线和横线' }
  }
  
  return { isValid: true }
}

// 格式化手机号（隐藏中间4位）
export function formatPhone(phone: string): string {
  if (!phone || phone.length !== 11) {
    return phone
  }
  return `${phone.slice(0, 3)}****${phone.slice(7)}`
}

// 创建认证错误对象
export function createAuthError(code: string, message?: string, details?: any): AuthError {
  return {
    code,
    message: message || errorMessages[code as keyof typeof errorMessages] || errorMessages.UNKNOWN_ERROR,
    details
  }
}

// 检查是否为移动设备
export function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

// 生成用户默认头像URL
export function generateDefaultAvatar(name: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FFB6C1', '#87CEEB', '#F0E68C', '#FFA07A'
  ]
  
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  const color = colors[hash % colors.length]
  const initial = name.charAt(0).toUpperCase()
  
  // 使用第三方头像生成服务或返回默认配置
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=${color.substring(1)}&color=fff&size=100`
}

// 生成唯一用户ID
export function generateUserId(): string {
  return crypto.randomUUID()
}

// 哈希密码
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

// 验证密码
export function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, hash] = storedPassword.split(':')
  const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex')
  return hash === newHash
}

// 生成JWT签名用的payload
export function createJwtPayload(userId: string, provider: string, extra?: any) {
  return {
    sub: userId,
    provider,
    iat: Math.floor(Date.now() / 1000),
    ...extra
  }
}

// 解析User-Agent获取设备信息
export function parseUserAgent(userAgent: string) {
  const mobile = isMobileDevice(userAgent)
  
  // 简单的浏览器检测
  let browser = 'Unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  
  // 简单的操作系统检测
  let os = 'Unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'
  
  return { mobile, browser, os }
}

// 生成缓存键
export function generateCacheKey(prefix: string, identifier: string): string {
  return `${prefix}${identifier}`
}

// 检查验证码是否过期
export function isCodeExpired(timestamp: number, expireMinutes: number): boolean {
  const now = Date.now()
  const expireTime = timestamp + (expireMinutes * 60 * 1000)
  return now > expireTime
}

// 格式化时间戳为可读时间
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 验证用户输入的安全性
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"'&]/g, '')
}

// 检查密码强度
export function checkPasswordStrength(password: string): {
  score: number // 0-4
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) {
    score++
  } else {
    feedback.push('密码至少需要8个字符')
  }
  
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) {
    score++
  } else {
    feedback.push('密码需要包含至少一个数字')
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
  
  if (score < 2) feedback.push('密码强度太弱')
  else if (score < 3) feedback.push('密码强度一般')
  
  return { score, feedback }
}

// URL参数编码
export function encodeQueryParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

// 安全的JSON解析
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
} 