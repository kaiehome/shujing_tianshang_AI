import { supabase } from '../supabaseClient'
import { smsService } from './smsService'
import { oauthService } from './oauthService'
import { 
  User, 
  UserProfile, 
  AuthResult, 
  AuthSession, 
  LoginCredentials, 
  WechatUserInfo, 
  AlipayUserInfo 
} from './types'
import { 
  validatePhone, 
  validateSmsCode, 
  validateNickname,
  generateUserId,
  generateDefaultAvatar,
  createAuthError,
  formatPhone
} from './utils'
import { authConfig, dbTables } from './config'
import jwt from 'jsonwebtoken'

// 开发模式下的内存存储
const developmentStorage = {
  users: new Map<string, User>(),
  sessions: new Map<string, AuthSession>()
}

// 开发模式检查
const isDevelopment = process.env.NODE_ENV === 'development'

// 检查 Supabase 客户端是否可用
const checkSupabase = () => {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return false
  }
  return true
}

// 获取 Supabase 客户端
const getSupabase = (): NonNullable<typeof supabase> => {
  if (!checkSupabase()) {
    throw new Error('Supabase client is not initialized')
  }
  return supabase!
}

// 创建默认用户资料
const createDefaultProfile = (userId: string, nickname: string): UserProfile => ({
  id: generateUserId(),
  user_id: userId,
  nickname,
  preferences: {
    language: 'zh-CN',
    theme: 'auto',
    notifications: {
      email: false,
      sms: true,
      push: true
    },
    privacy: {
      profile_public: false,
      works_public: true
    }
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

export class AuthService {
  
  /**
   * 发送短信验证码
   */
  async sendSmsCode(phone: string, type: 'login' | 'register' = 'login'): Promise<{ 
    success: boolean 
    error?: string 
  }> {
    // 验证手机号
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.isValid) {
      return { success: false, error: phoneValidation.error }
    }
    
    // 发送验证码
    return await smsService.sendVerificationCode(phone, type)
  }
  
  /**
   * 手机验证码登录
   */
  async loginWithPhone(phone: string, code: string): Promise<AuthResult> {
    try {
      // 验证手机号
      const phoneValidation = validatePhone(phone)
      if (!phoneValidation.isValid) {
        return {
          success: false,
          error: createAuthError('INVALID_PHONE', phoneValidation.error)
        }
      }
      
      // 验证验证码格式
      const codeValidation = validateSmsCode(code)
      if (!codeValidation.isValid) {
        return {
          success: false,
          error: createAuthError('SMS_CODE_INVALID', codeValidation.error)
        }
      }
      
      // 验证短信验证码
      const smsVerification = await smsService.verifyCode(phone, code, 'login')
      if (!smsVerification.success) {
        return {
          success: false,
          error: createAuthError('SMS_CODE_INVALID', smsVerification.error)
        }
      }
      
      // 查找或创建用户
      let user = await this.findUserByPhone(phone)
      if (!user) {
        user = await this.createUserByPhone(phone)
      }
      
      if (!user) {
        return {
          success: false,
          error: createAuthError('USER_NOT_FOUND', '用户创建失败')
        }
      }
      
      // 更新最后登录时间
      await this.updateLastLogin(user.id)
      
      // 创建会话
      const session = await this.createSession(user)
      
      return {
        success: true,
        user,
        session
      }
      
    } catch (error) {
      console.error('手机登录失败:', error)
      return {
        success: false,
        error: createAuthError('UNKNOWN_ERROR', '登录失败，请重试')
      }
    }
  }
  
  /**
   * 微信登录
   */
  async loginWithWechat(code: string, state?: string): Promise<AuthResult> {
    const result = await oauthService.handleCallback('wechat', code, state!)
    
    // 转换错误格式以匹配AuthResult类型
    if (!result.success && result.error) {
      return {
        success: false,
        error: createAuthError('OAUTH_ERROR', result.error)
      }
    }
    
    return {
      success: result.success,
      user: result.user,
      session: result.user && result.token ? {
        user: result.user,
        access_token: result.token,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
      } : undefined,
      redirect_url: '/'
    }
  }
  
  /**
   * 支付宝登录
   */
  async loginWithAlipay(code: string, state?: string): Promise<AuthResult> {
    const result = await oauthService.handleCallback('alipay', code, state!)
    
    // 转换错误格式以匹配AuthResult类型
    if (!result.success && result.error) {
      return {
        success: false,
        error: createAuthError('OAUTH_ERROR', result.error)
      }
    }
    
    return {
      success: result.success,
      user: result.user,
      session: result.user && result.token ? {
        user: result.user,
        access_token: result.token,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
      } : undefined,
      redirect_url: '/'
    }
  }
  
  /**
   * 获取微信授权URL
   */
  async getWechatAuthUrl(redirectUri?: string): Promise<string> {
    const result = await oauthService.generateAuthUrl('wechat', redirectUri)
    if (!result.success || !result.authUrl) {
      throw new Error(result.error || '生成微信授权URL失败')
    }
    return result.authUrl
  }
  
  /**
   * 获取支付宝授权URL
   */
  async getAlipayAuthUrl(redirectUri?: string): Promise<string> {
    const result = await oauthService.generateAuthUrl('alipay', redirectUri)
    if (!result.success || !result.authUrl) {
      throw new Error(result.error || '生成支付宝授权URL失败')
    }
    return result.authUrl
  }
  
  /**
   * 获取当前用户
   */
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      // 验证JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
      
      // 从数据库获取用户信息
      const client = getSupabase()
      const { data: user, error } = await client
        .from(dbTables.users)
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', decoded.sub)
        .eq('is_active', true)
        .single()
      
      if (error || !user) {
        return null
      }
      
      return this.transformUserData(user)
      
    } catch (error) {
      console.error('获取当前用户失败:', error)
      return null
    }
  }
  
  /**
   * 更新用户资料
   */
  async updateUserProfile(
    userId: string, 
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证昵称（如果有）
      if (updates.nickname) {
        const nicknameValidation = validateNickname(updates.nickname)
        if (!nicknameValidation.isValid) {
          return { success: false, error: nicknameValidation.error }
        }
      }
      
      const client = getSupabase()
      const { error } = await client
        .from(dbTables.user_profiles)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
      
      if (error) {
        console.error('更新用户资料失败:', error)
        return { success: false, error: '更新用户资料失败' }
      }
      
      return { success: true }
      
    } catch (error) {
      console.error('更新用户资料异常:', error)
      return { success: false, error: '更新用户资料失败' }
    }
  }
  
  /**
   * 登出
   */
  async logout(sessionToken: string): Promise<{ success: boolean }> {
    try {
      // 删除会话记录
      const client = getSupabase()
      await client
        .from(dbTables.auth_sessions)
        .delete()
        .eq('access_token', sessionToken)
      
      return { success: true }
      
    } catch (error) {
      console.error('登出失败:', error)
      return { success: true } // 即使失败也返回成功，避免影响用户体验
    }
  }
  
  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const client = getSupabase()
      // 验证refresh token
      const { data: session, error } = await client
        .from(dbTables.auth_sessions)
        .select('*')
        .eq('refresh_token', refreshToken)
        .gt('expires_at', new Date().toISOString())
        .single()
      
      if (error || !session) {
        return {
          success: false,
          error: createAuthError('INVALID_TOKEN', '令牌无效或已过期')
        }
      }
      
      // 获取用户信息
      const user = await this.findUserById(session.user_id)
      if (!user) {
        return {
          success: false,
          error: createAuthError('USER_NOT_FOUND', '用户不存在')
        }
      }
      
      // 创建新的会话
      const newSession = await this.createSession(user)
      
      // 删除旧的会话
      await client
        .from(dbTables.auth_sessions)
        .delete()
        .eq('id', session.id)
      
      return {
        success: true,
        user,
        session: newSession
      }
      
    } catch (error) {
      console.error('刷新令牌失败:', error)
      return {
        success: false,
        error: createAuthError('UNKNOWN_ERROR', '令牌刷新失败')
      }
    }
  }
  
  /**
   * 根据手机号查找用户
   */
  private async findUserByPhone(phone: string): Promise<User | null> {
    try {
      if (isDevelopment) {
        // 开发模式下从内存中查找
        for (const user of developmentStorage.users.values()) {
          if (user.phone === phone) {
            return user
          }
        }
        return null
      }
      
      const client = getSupabase()
      const { data: user, error } = await client
        .from(dbTables.users)
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('phone', phone)
        .eq('is_active', true)
        .single()
      
      if (error || !user) {
        return null
      }
      
      return this.transformUserData(user)
      
    } catch (error) {
      console.error('查找用户失败:', error)
      return null
    }
  }
  
  /**
   * 根据用户ID查找用户
   */
  private async findUserById(userId: string): Promise<User | null> {
    try {
      const client = getSupabase()
      const { data: user, error } = await client
        .from(dbTables.users)
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', userId)
        .eq('is_active', true)
        .single()
      
      if (error || !user) {
        return null
      }
      
      return this.transformUserData(user)
      
    } catch (error) {
      console.error('查找用户失败:', error)
      return null
    }
  }
  
  /**
   * 根据手机号创建用户
   */
  private async createUserByPhone(phone: string): Promise<User | null> {
    try {
      const userId = generateUserId()
      const userName = `用户${phone.slice(-4)}`
      const avatar = generateDefaultAvatar(userName)
      const profile = createDefaultProfile(userId, userName)
      
      const user: User = {
        id: userId,
        phone,
        name: userName,
        avatar,
        provider: 'phone',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        profile
      }
      
      if (isDevelopment) {
        // 开发模式下保存到内存
        developmentStorage.users.set(userId, user)
        console.log(`[开发模式] 创建用户: ${phone}`)
        return user
      }
      
      const client = getSupabase()
      
      // 生产模式下保存到数据库
      const { data: dbUser, error: userError } = await client
        .from(dbTables.users)
        .insert({
          id: userId,
          phone,
          name: userName,
          avatar,
          provider: 'phone',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single()
      
      if (userError) {
        console.error('创建用户失败:', userError)
        return null
      }
      
      // 创建用户资料
      const { error: profileError } = await client
        .from(dbTables.user_profiles)
        .insert({
          id: profile.id,
          user_id: userId,
          nickname: userName,
          preferences: profile.preferences,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        })
      
      if (profileError) {
        console.error('创建用户资料失败:', profileError)
        // 用户已创建，资料创建失败不影响登录
      }
      
      return this.transformUserData(dbUser)
      
    } catch (error) {
      console.error('创建用户异常:', error)
      return null
    }
  }
  
  /**
   * 更新最后登录时间
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      if (isDevelopment) {
        // 开发模式下更新内存中的用户
        const user = developmentStorage.users.get(userId)
        if (user) {
          user.last_login = new Date().toISOString()
          developmentStorage.users.set(userId, user)
        }
        return
      }
      
      const client = getSupabase()
      await client
        .from(dbTables.users)
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
    } catch (error) {
      console.error('更新最后登录时间失败:', error)
    }
  }
  
  /**
   * 创建会话
   */
  private async createSession(user: User): Promise<AuthSession> {
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = now + authConfig.session.max_age
    
    // 创建JWT token
    const accessToken = jwt.sign(
      {
        sub: user.id,
        provider: user.provider,
        iat: now,
        exp: expiresAt
      },
      process.env.JWT_SECRET || 'default-secret'
    )
    
    // 创建refresh token
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        type: 'refresh',
        iat: now
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '30d' }
    )
    
    const session: AuthSession = {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    }
    
    if (isDevelopment) {
      // 开发模式下保存到内存
      developmentStorage.sessions.set(accessToken, session)
      console.log(`[开发模式] 创建会话: ${user.id}`)
      return session
    }
    
    // 生产模式下保存到数据库
    try {
      const client = getSupabase()
      await client
        .from(dbTables.auth_sessions)
        .insert({
          id: generateUserId(),
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(expiresAt * 1000).toISOString(),
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('保存会话失败:', error)
      // 不影响登录流程
    }
    
    return session
  }
  
  /**
   * 转换用户数据格式
   */
  private transformUserData(data: any): User {
    const profile = data.user_profiles?.[0]
    return {
      id: data.id,
      phone: data.phone,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      provider: data.provider,
      openid: data.openid,
      unionid: data.unionid,
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_login: data.last_login,
      is_active: data.is_active,
      profile: profile || undefined
    }
  }
}

// 创建默认的认证服务实例
export const authService = new AuthService() 