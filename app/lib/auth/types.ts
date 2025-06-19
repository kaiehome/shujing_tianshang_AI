// 认证相关类型定义

export interface User {
  id: string
  phone?: string
  email?: string
  name?: string
  avatar?: string
  provider: 'phone' | 'wechat' | 'alipay' | 'email'
  openid?: string // 微信/支付宝的用户唯一标识
  unionid?: string // 微信UnionID
  created_at: string
  updated_at: string
  last_login: string
  is_active: boolean
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  nickname?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  location?: string
  bio?: string
  preferences?: UserPreferences
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  language: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profile_public: boolean
    works_public: boolean
  }
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token?: string
  expires_at: number
}

export interface LoginCredentials {
  phone?: string
  email?: string
  code?: string
  password?: string
}

export interface SmsVerification {
  phone: string
  code: string
  type: 'login' | 'register' | 'reset_password' | 'bind_phone'
  expires_at: number
  attempts: number
  is_used: boolean
}

// OAuth相关类型定义
export type OAuthProvider = 'wechat' | 'alipay' | 'google' | 'github'

export interface OAuthState {
  id: string
  state: string
  provider: OAuthProvider
  nonce?: string
  redirect_uri?: string
  created_at: string
  expires_at: string
}

export interface OAuthUserInfo {
  provider: OAuthProvider
  providerId: string
  username: string
  avatar?: string
  email?: string
  rawData: any
}

export interface OAuthAccount {
  id: string
  user_id: string
  provider: OAuthProvider
  provider_user_id: string
  provider_username?: string
  provider_email?: string
  provider_avatar?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  provider_data: any
  is_verified: boolean
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface WechatAuthData {
  code: string
  state?: string
}

export interface AlipayAuthData {
  auth_code: string
  state?: string
}

export interface WechatUserInfo {
  openid: string
  unionid?: string
  nickname: string
  sex: number // 1男性，2女性，0未知
  province: string
  city: string
  country: string
  headimgurl: string
  privilege: string[]
}

export interface AlipayUserInfo {
  user_id: string
  nick_name: string
  avatar: string
  gender: 'M' | 'F'
  province: string
  city: string
}

export interface AuthProvider {
  id: string
  name: string
  type: 'oauth' | 'sms' | 'email'
  icon: string
  color: string
  enabled: boolean
}

export interface AuthError {
  code: string
  message: string
  details?: any
}

export interface AuthResult {
  success: boolean
  user?: User
  session?: AuthSession
  error?: AuthError
  redirect_url?: string
}

// 认证服务接口
export interface AuthService {
  // 手机验证码登录
  sendSmsCode(phone: string, type: string): Promise<{ success: boolean; error?: string }>
  verifySmsCode(phone: string, code: string): Promise<AuthResult>
  
  // 微信登录
  getWechatAuthUrl(redirect_uri: string): string
  handleWechatCallback(code: string, state?: string): Promise<AuthResult>
  
  // 支付宝登录
  getAlipayAuthUrl(redirect_uri: string): string
  handleAlipayCallback(auth_code: string, state?: string): Promise<AuthResult>
  
  // 用户管理
  getCurrentUser(): Promise<User | null>
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }>
  
  // 会话管理
  refreshToken(refresh_token: string): Promise<AuthResult>
  logout(): Promise<{ success: boolean }>
}

// 认证配置
export interface AuthConfig {
  providers: {
    phone: {
      enabled: boolean
      sms_provider: 'alicloud'
      code_length: number
      code_expire_minutes: number
      max_attempts: number
    }
    wechat: {
      enabled: boolean
      app_id: string
      app_secret: string
      scope: string
    }
    alipay: {
      enabled: boolean
      app_id: string
      private_key: string
      public_key: string
    }
  }
  session: {
    max_age: number // seconds
    refresh_threshold: number // seconds
  }
  security: {
    rate_limit: {
      sms: number // per hour
      login: number // per minute
    }
    password_policy?: {
      min_length: number
      require_uppercase: boolean
      require_lowercase: boolean
      require_numbers: boolean
      require_special: boolean
    }
  }
} 