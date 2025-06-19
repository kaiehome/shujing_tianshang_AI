import { alicloudConfig, authConfig, cacheKeys } from './config'
import { generateSmsCode, createAuthError, isCodeExpired } from './utils'
import { SmsVerification } from './types'
import { supabase } from '../supabaseClient'
import { aliCloudSms } from './alicloudSms'

// 检查supabase是否可用的辅助函数
function ensureSupabase() {
  if (!supabase) {
    throw new Error('数据库连接不可用')
  }
  return supabase
}

interface SmsConfig {
  accessKeyId: string
  accessKeySecret: string
  endpoint?: string
  isDevelopment?: boolean
}

// 开发模式下的内存存储
const developmentSmsStorage = new Map<string, {
  phone: string
  code: string
  type: string
  attempts: number
  created_at: number
  expires_at: number
  is_used: boolean
}>()

const developmentRateLimit = new Map<string, number[]>()

export class SmsService {
  private config: SmsConfig
  
  constructor(config: SmsConfig) {
    this.config = {
      ...config,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  }
  
  /**
   * 发送短信验证码
   */
  async sendVerificationCode(
    phone: string, 
    type: 'login' | 'register' | 'reset_password' | 'bind_phone' = 'login'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 检查发送频率限制
      const rateLimitCheck = await this.checkRateLimit(phone)
      if (!rateLimitCheck.allowed) {
        return { 
          success: false, 
          error: '验证码发送过于频繁，请稍后再试' 
        }
      }
      
      // 生成验证码
      const code = generateSmsCode(authConfig.providers.phone.code_length)
      
      // 发送短信
      const sendResult = await this.sendSms(phone, code)
      if (!sendResult.success) {
        return sendResult
      }
      
      // 保存验证码到数据库或内存
      const saveResult = await this.saveVerificationCode(phone, code, type)
      if (!saveResult.success) {
        return { 
          success: false, 
          error: '验证码保存失败，请重试' 
        }
      }
      
      // 更新发送次数统计
      await this.updateRateLimit(phone)
      
      return { success: true }
      
    } catch (error) {
      console.error('发送验证码失败:', error)
      return { 
        success: false, 
        error: '验证码发送失败，请稍后重试' 
      }
    }
  }
  
  /**
   * 验证短信验证码
   */
  async verifyCode(
    phone: string, 
    code: string, 
    type: 'login' | 'register' | 'reset_password' | 'bind_phone' = 'login'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.config.isDevelopment) {
        return this.verifyCodeDevelopment(phone, code, type)
      }
      
      // 从数据库获取验证码记录
      if (!supabase) {
        return { 
          success: false, 
          error: '数据库连接失败' 
        }
      }
      
      const { data: verification, error } = await ensureSupabase()
        .from('sms_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('type', type)
        .eq('is_used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error || !verification) {
        return { 
          success: false, 
          error: '验证码不存在或已过期' 
        }
      }
      
      // 检查验证码是否过期
      const isExpired = isCodeExpired(
        new Date(verification.created_at).getTime(),
        authConfig.providers.phone.code_expire_minutes
      )
      
      if (isExpired) {
        // 标记验证码为已使用
        await this.markCodeAsUsed(verification.id)
        return { 
          success: false, 
          error: '验证码已过期，请重新获取' 
        }
      }
      
      // 检查尝试次数
      if (verification.attempts >= authConfig.providers.phone.max_attempts) {
        // 标记验证码为已使用
        await this.markCodeAsUsed(verification.id)
        return { 
          success: false, 
          error: '验证码尝试次数过多，请重新获取' 
        }
      }
      
      // 验证码错误
      if (verification.code !== code) {
        // 增加尝试次数
        await this.incrementAttempts(verification.id)
        return { 
          success: false, 
          error: '验证码错误' 
        }
      }
      
      // 验证成功，标记为已使用
      await this.markCodeAsUsed(verification.id)
      
      return { success: true }
      
    } catch (error) {
      console.error('验证码验证失败:', error)
      return { 
        success: false, 
        error: '验证码验证失败，请重试' 
      }
    }
  }
  
  /**
   * 开发模式下验证验证码
   */
  private verifyCodeDevelopment(
    phone: string, 
    code: string, 
    type: string
  ): { success: boolean; error?: string } {
    const key = `${phone}_${type}`
    const stored = developmentSmsStorage.get(key)
    
    if (!stored) {
      return { 
        success: false, 
        error: '验证码不存在或已过期' 
      }
    }
    
    // 检查是否过期
    if (Date.now() > stored.expires_at) {
      developmentSmsStorage.delete(key)
      return { 
        success: false, 
        error: '验证码已过期，请重新获取' 
      }
    }
    
    // 检查是否已使用
    if (stored.is_used) {
      return { 
        success: false, 
        error: '验证码已使用，请重新获取' 
      }
    }
    
    // 检查尝试次数
    if (stored.attempts >= authConfig.providers.phone.max_attempts) {
      developmentSmsStorage.delete(key)
      return { 
        success: false, 
        error: '验证码尝试次数过多，请重新获取' 
      }
    }
    
    // 验证码错误
    if (stored.code !== code) {
      stored.attempts += 1
      developmentSmsStorage.set(key, stored)
      return { 
        success: false, 
        error: '验证码错误' 
      }
    }
    
    // 验证成功，标记为已使用
    stored.is_used = true
    developmentSmsStorage.set(key, stored)
    
    return { success: true }
  }
  
  /**
   * 发送短信（使用真实的阿里云API）
   */
  private async sendSms(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 开发环境直接返回成功
      if (this.config.isDevelopment) {
        console.log(`[开发模式] 发送验证码到 ${phone}: ${code}`)
        return { success: true }
      }
      
      // 生产环境使用阿里云短信服务
      if (!this.config.accessKeyId || !this.config.accessKeySecret) {
        console.warn('⚠️ 阿里云短信配置不完整，使用模拟模式')
        console.log(`[模拟模式] 发送验证码到 ${phone}: ${code}`)
        return { success: true }
      }

      // 验证阿里云配置
      const configValidation = aliCloudSms.validateConfig()
      if (!configValidation.valid) {
        console.error('阿里云短信配置验证失败:', configValidation.missing)
        return { 
          success: false, 
          error: `配置错误: 缺少 ${configValidation.missing.join(', ')}` 
        }
      }

      // 发送真实短信
      console.log(`[生产模式] 通过阿里云发送验证码到 ${phone}`)
      const result = await aliCloudSms.sendSms(phone, code)
      
      if (result.success) {
        console.log(`✅ 短信发送成功: ${phone}`)
      } else {
        console.error(`❌ 短信发送失败: ${phone} - ${result.error}`)
      }
      
      return result
      
    } catch (error) {
      console.error('短信发送异常:', error)
      return { 
        success: false, 
        error: '短信发送失败，请稍后重试' 
      }
    }
  }
  
  /**
   * 保存验证码到数据库或内存
   */
  private async saveVerificationCode(
    phone: string, 
    code: string, 
    type: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.config.isDevelopment) {
        // 开发模式下保存到内存
        const key = `${phone}_${type}`
        const now = Date.now()
        const expiresAt = now + (authConfig.providers.phone.code_expire_minutes * 60 * 1000)
        
        developmentSmsStorage.set(key, {
          phone,
          code,
          type,
          attempts: 0,
          created_at: now,
          expires_at: expiresAt,
          is_used: false
        })
        
        console.log(`[开发模式] 验证码已保存到内存: ${phone} -> ${code}`)
        return { success: true }
      }
      
      // 生产模式下保存到数据库
      const { error } = await ensureSupabase()
        .from('sms_verifications')
        .insert({
          phone,
          code,
          type,
          attempts: 0,
          is_used: false,
          created_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + authConfig.providers.phone.code_expire_minutes * 60 * 1000
          ).toISOString()
        })
      
      if (error) {
        console.error('保存验证码失败:', error)
        return { success: false, error: '验证码保存失败' }
      }
      
      return { success: true }
      
    } catch (error) {
      console.error('保存验证码异常:', error)
      return { success: false, error: '验证码保存失败' }
    }
  }
  
  /**
   * 检查发送频率限制
   */
  private async checkRateLimit(phone: string): Promise<{ allowed: boolean; remaining?: number }> {
    try {
      if (this.config.isDevelopment) {
        // 开发模式下使用内存检查
        const now = Date.now()
        const oneHourAgo = now - (60 * 60 * 1000)
        const timestamps = developmentRateLimit.get(phone) || []
        
        // 清理过期的时间戳
        const validTimestamps = timestamps.filter(t => t > oneHourAgo)
        developmentRateLimit.set(phone, validTimestamps)
        
        const allowed = validTimestamps.length < authConfig.security.rate_limit.sms
        const remaining = Math.max(0, authConfig.security.rate_limit.sms - validTimestamps.length)
        
        return { allowed, remaining }
      }
      
      // 生产模式下使用数据库检查
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      const { data, error } = await ensureSupabase()
        .from('sms_verifications')
        .select('id')
        .eq('phone', phone)
        .gte('created_at', oneHourAgo.toISOString())
      
      if (error) {
        console.error('检查发送频率失败:', error)
        return { allowed: true } // 发生错误时允许发送
      }
      
      const sendCount = data?.length || 0
      const allowed = sendCount < authConfig.security.rate_limit.sms
      const remaining = Math.max(0, authConfig.security.rate_limit.sms - sendCount)
      
      return { allowed, remaining }
      
    } catch (error) {
      console.error('检查发送频率异常:', error)
      return { allowed: true }
    }
  }
  
  /**
   * 更新发送次数统计
   */
  private async updateRateLimit(phone: string): Promise<void> {
    if (this.config.isDevelopment) {
      // 开发模式下更新内存记录
      const timestamps = developmentRateLimit.get(phone) || []
      timestamps.push(Date.now())
      developmentRateLimit.set(phone, timestamps)
    }
    // 生产模式下依赖数据库记录来实现限流
  }
  
  /**
   * 标记验证码为已使用
   */
  private async markCodeAsUsed(verificationId: string): Promise<void> {
    try {
      await ensureSupabase()
        .from('sms_verifications')
        .update({ 
          is_used: true, 
          used_at: new Date().toISOString() 
        })
        .eq('id', verificationId)
    } catch (error) {
      console.error('标记验证码为已使用失败:', error)
    }
  }
  
  /**
   * 增加验证尝试次数
   */
  private async incrementAttempts(verificationId: string): Promise<void> {
    try {
      const { data: current } = await ensureSupabase()
        .from('sms_verifications')
        .select('attempts')
        .eq('id', verificationId)
        .single()
      
      if (current) {
        await ensureSupabase()
          .from('sms_verifications')
          .update({ attempts: current.attempts + 1 })
          .eq('id', verificationId)
      }
    } catch (error) {
      console.error('增加验证尝试次数失败:', error)
    }
  }
  
  /**
   * 清理过期的验证码记录
   */
  async cleanupExpiredCodes(): Promise<void> {
    try {
      if (this.config.isDevelopment) {
        // 清理内存中的过期记录
        const now = Date.now()
        for (const [key, stored] of developmentSmsStorage.entries()) {
          if (now > stored.expires_at || stored.is_used) {
            developmentSmsStorage.delete(key)
          }
        }
        return
      }
      
      const now = new Date().toISOString()
      await ensureSupabase()
        .from('sms_verifications')
        .delete()
        .lt('expires_at', now)
    } catch (error) {
      console.error('清理过期验证码失败:', error)
    }
  }
}

// 创建默认的短信服务实例
export const smsService = new SmsService({
  accessKeyId: alicloudConfig.accessKeyId,
  accessKeySecret: alicloudConfig.accessKeySecret,
  endpoint: alicloudConfig.endpoint
}) 