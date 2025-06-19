import { AuthConfig, AuthProvider } from './types'

// 认证配置
export const authConfig: AuthConfig = {
  providers: {
    phone: {
      enabled: true,
      sms_provider: 'alicloud',
      code_length: 6,
      code_expire_minutes: 5,
      max_attempts: 3
    },
    wechat: {
      enabled: true,
      app_id: process.env.WECHAT_APP_ID || '',
      app_secret: process.env.WECHAT_APP_SECRET || '',
      scope: 'snsapi_login' // 网站应用授权作用域
    },
    alipay: {
      enabled: true,
      app_id: process.env.ALIPAY_APP_ID || '',
      private_key: process.env.ALIPAY_PRIVATE_KEY || '',
      public_key: process.env.ALIPAY_PUBLIC_KEY || ''
    }
  },
  session: {
    max_age: 7 * 24 * 60 * 60, // 7天
    refresh_threshold: 24 * 60 * 60 // 24小时内自动刷新
  },
  security: {
    rate_limit: {
      sms: 10, // 每小时最多10条短信
      login: 5 // 每分钟最多5次登录尝试
    },
    password_policy: {
      min_length: 8,
      require_uppercase: false,
      require_lowercase: false,
      require_numbers: true,
      require_special: false
    }
  }
}

// 支持的认证提供商列表
export const authProviders: AuthProvider[] = [
  {
    id: 'phone',
    name: '手机验证码',
    type: 'sms',
    icon: '📱',
    color: '#10B981',
    enabled: authConfig.providers.phone.enabled
  },
  {
    id: 'wechat',
    name: '微信登录',
    type: 'oauth',
    icon: '💬',
    color: '#07C160',
    enabled: authConfig.providers.wechat.enabled && !!authConfig.providers.wechat.app_id
  },
  {
    id: 'alipay',
    name: '支付宝登录',
    type: 'oauth',
    icon: '💰',
    color: '#1677FF',
    enabled: authConfig.providers.alipay.enabled && !!authConfig.providers.alipay.app_id
  }
]

// 阿里云短信配置
export const alicloudConfig = {
  accessKeyId: process.env.ALICLOUD_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALICLOUD_ACCESS_KEY_SECRET || '',
  signName: process.env.ALICLOUD_SMS_SIGN_NAME || '',
  templateCode: process.env.ALICLOUD_SMS_TEMPLATE_CODE || '',
  endpoint: 'https://dysmsapi.aliyuncs.com'
}

// 微信配置
export const wechatConfig = {
  appId: process.env.WECHAT_APP_ID || '',
  appSecret: process.env.WECHAT_APP_SECRET || '',
  scope: 'snsapi_login',
  authUrl: 'https://open.weixin.qq.com/connect/qrconnect',
  accessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
  userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
  redirectUri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/auth/wechat/callback` : 'http://localhost:3000/auth/wechat/callback'
}

// 支付宝配置
export const alipayConfig = {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  publicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gatewayUrl: 'https://openapi.alipay.com/gateway.do',
  authUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
  scope: 'auth_user',
  redirectUri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/auth/alipay/callback` : 'http://localhost:3000/auth/alipay/callback'
}

// JWT配置
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-jwt-secret',
  algorithm: 'HS256' as const,
  expiresIn: '7d',
  refreshExpiresIn: '30d'
}

// 数据库表名配置
export const dbTables = {
  users: 'users',
  user_profiles: 'user_profiles',
  sms_verifications: 'sms_verifications',
  auth_sessions: 'auth_sessions'
}

// 错误消息映射
export const errorMessages = {
  // 通用错误
  UNKNOWN_ERROR: '未知错误，请稍后重试',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  
  // 认证错误
  INVALID_CREDENTIALS: '登录信息无效',
  USER_NOT_FOUND: '用户不存在',
  USER_ALREADY_EXISTS: '用户已存在',
  ACCOUNT_DISABLED: '账户已被禁用',
  INVALID_TOKEN: '令牌无效或已过期',
  
  // 短信相关错误
  INVALID_PHONE: '手机号格式不正确',
  SMS_SEND_FAILED: '验证码发送失败，请稍后重试',
  SMS_CODE_INVALID: '验证码错误或已过期',
  SMS_CODE_EXPIRED: '验证码已过期，请重新获取',
  SMS_RATE_LIMIT: '验证码发送过于频繁，请稍后再试',
  
  // 第三方登录错误
  OAUTH_ERROR: '第三方登录失败',
  WECHAT_AUTH_FAILED: '微信授权失败',
  ALIPAY_AUTH_FAILED: '支付宝授权失败',
  OAUTH_CALLBACK_ERROR: '授权回调处理失败',
  
  // 用户数据错误
  PROFILE_UPDATE_FAILED: '用户资料更新失败',
  INVALID_USER_DATA: '用户数据格式错误'
}

// 验证规则
export const validationRules = {
  phone: /^1[3-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: authConfig.security.password_policy?.min_length || 8,
    maxLength: 100
  },
  smsCode: /^\d{6}$/,
  nickname: {
    minLength: 2,
    maxLength: 20,
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/
  }
}

// 缓存键前缀
export const cacheKeys = {
  smsCode: 'sms_code:',
  rateLimitSms: 'rate_limit_sms:',
  rateLimitLogin: 'rate_limit_login:',
  userSession: 'user_session:',
  wechatState: 'wechat_state:',
  alipayState: 'alipay_state:'
} 