import { supabase } from '../supabaseClient'
import { wechatConfig, alipayConfig } from './config'
import { generateRandomString, createAuthError } from './utils'
import { OAuthProvider, OAuthState, OAuthUserInfo } from './types'
import crypto from 'crypto'

// 检查supabase是否可用的辅助函数
function ensureSupabase() {
  if (!supabase) {
    throw new Error('数据库连接不可用')
  }
  return supabase
}

export class OAuthService {
  /**
   * 生成OAuth登录URL
   */
  async generateAuthUrl(provider: OAuthProvider, redirectUri?: string): Promise<{ 
    success: boolean 
    authUrl?: string 
    error?: string 
  }> {
    try {
      // 生成state和nonce用于安全验证
      const state = generateRandomString(32)
      const nonce = generateRandomString(16)
      
      // 保存state到数据库
      await this.saveOAuthState(state, provider, nonce, redirectUri)
      
      let authUrl: string
      
      switch (provider) {
        case 'wechat':
          authUrl = await this.generateWechatAuthUrl(state)
          break
        case 'alipay':
          authUrl = await this.generateAlipayAuthUrl(state)
          break
        default:
          return { success: false, error: '不支持的登录方式' }
      }
      
      return { success: true, authUrl }
      
    } catch (error) {
      console.error('生成OAuth登录URL失败:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '生成登录链接失败' 
      }
    }
  }
  
  /**
   * 处理OAuth回调
   */
  async handleCallback(
    provider: OAuthProvider, 
    code: string, 
    state: string
  ): Promise<{ 
    success: boolean 
    user?: any 
    token?: string 
    error?: string 
  }> {
    try {
      // 验证state
      const stateRecord = await this.verifyOAuthState(state, provider)
      if (!stateRecord) {
        return { success: false, error: '无效的授权状态' }
      }
      
      // 获取访问令牌
      const tokenResult = await this.exchangeCodeForToken(provider, code)
      if (!tokenResult.success) {
        return { success: false, error: tokenResult.error }
      }
      
      // 获取用户信息
      const userInfoResult = await this.getUserInfo(provider, tokenResult.accessToken!)
      if (!userInfoResult.success) {
        return { success: false, error: userInfoResult.error }
      }
      
      // 创建或更新用户
      const userResult = await this.createOrUpdateUser(
        provider, 
        userInfoResult.userInfo!, 
        tokenResult.accessToken!,
        tokenResult.refreshToken
      )
      
      if (!userResult.success) {
        return { success: false, error: userResult.error }
      }
      
      // 记录登录历史
      await this.recordLoginHistory(userResult.user!.id, provider, true)
      
      // 清理已使用的state
      await this.cleanupOAuthState(state)
      
      return { 
        success: true, 
        user: userResult.user, 
        token: userResult.token 
      }
      
    } catch (error) {
      console.error('OAuth回调处理失败:', error)
      
      // 记录失败的登录尝试
      try {
        await this.recordLoginHistory(null, provider, false, error instanceof Error ? error.message : '未知错误')
      } catch (recordError) {
        console.error('记录登录历史失败:', recordError)
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OAuth认证失败' 
      }
    }
  }
  
  /**
   * 生成微信授权URL
   */
  private async generateWechatAuthUrl(state: string): Promise<string> {
    if (!wechatConfig.appId) {
      throw new Error('微信登录未配置')
    }
    
    const params = new URLSearchParams({
      appid: wechatConfig.appId,
      redirect_uri: wechatConfig.redirectUri,
      response_type: 'code',
      scope: wechatConfig.scope,
      state: state
    })
    
    return `${wechatConfig.authUrl}?${params.toString()}`
  }
  
  /**
   * 生成支付宝授权URL
   */
  private async generateAlipayAuthUrl(state: string): Promise<string> {
    if (!alipayConfig.appId) {
      throw new Error('支付宝登录未配置')
    }
    
    const params = new URLSearchParams({
      app_id: alipayConfig.appId,
      scope: alipayConfig.scope,
      redirect_uri: alipayConfig.redirectUri,
      state: state
    })
    
    return `${alipayConfig.authUrl}?${params.toString()}`
  }
  
  /**
   * 保存OAuth状态
   */
  private async saveOAuthState(
    state: string, 
    provider: OAuthProvider, 
    nonce: string, 
    redirectUri?: string
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10分钟过期
    
    const { error } = await ensureSupabase()
      .from('oauth_states')
      .insert({
        state,
        provider,
        nonce,
        redirect_uri: redirectUri,
        expires_at: expiresAt.toISOString()
      })
    
    if (error) {
      throw new Error(`保存OAuth状态失败: ${error.message}`)
    }
  }
  
  /**
   * 验证OAuth状态
   */
  private async verifyOAuthState(state: string, provider: OAuthProvider): Promise<OAuthState | null> {
    const { data, error } = await ensureSupabase()
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .eq('provider', provider)
      .gte('expires_at', new Date().toISOString())
      .single()
    
    if (error || !data) {
      return null
    }
    
    return data as OAuthState
  }
  
  /**
   * 清理已使用的OAuth状态
   */
  private async cleanupOAuthState(state: string): Promise<void> {
    await ensureSupabase()
      .from('oauth_states')
      .delete()
      .eq('state', state)
  }
  
  /**
   * 用授权码换取访问令牌
   */
  private async exchangeCodeForToken(
    provider: OAuthProvider, 
    code: string
  ): Promise<{ 
    success: boolean 
    accessToken?: string 
    refreshToken?: string 
    error?: string 
  }> {
    try {
      switch (provider) {
        case 'wechat':
          return await this.exchangeWechatCode(code)
        case 'alipay':
          return await this.exchangeAlipayCode(code)
        default:
          return { success: false, error: '不支持的登录方式' }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '获取访问令牌失败' 
      }
    }
  }
  
  /**
   * 微信授权码换取令牌
   */
  private async exchangeWechatCode(code: string): Promise<{ 
    success: boolean 
    accessToken?: string 
    refreshToken?: string 
    error?: string 
  }> {
    const params = new URLSearchParams({
      appid: wechatConfig.appId,
      secret: wechatConfig.appSecret,
      code: code,
      grant_type: 'authorization_code'
    })
    
    const response = await fetch(`${wechatConfig.accessTokenUrl}?${params.toString()}`)
    const data = await response.json()
    
    if (data.errcode) {
      return { success: false, error: `微信认证失败: ${data.errmsg}` }
    }
    
    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    }
  }
  
  /**
   * 支付宝授权码换取令牌
   */
  private async exchangeAlipayCode(code: string): Promise<{ 
    success: boolean 
    accessToken?: string 
    refreshToken?: string 
    error?: string 
  }> {
    // 支付宝API调用需要签名，这里简化处理
    // 实际生产环境需要完整的支付宝SDK
    const params = {
      method: 'alipay.system.oauth.token',
      app_id: alipayConfig.appId,
      grant_type: 'authorization_code',
      code: code,
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z/, ''),
      version: '1.0'
    }
    
    // TODO: 实现支付宝签名和API调用
    // 这里返回模拟数据
    return {
      success: true,
      accessToken: 'mock_alipay_token',
      refreshToken: 'mock_alipay_refresh_token'
    }
  }
  
  /**
   * 获取用户信息
   */
  private async getUserInfo(
    provider: OAuthProvider, 
    accessToken: string
  ): Promise<{ 
    success: boolean 
    userInfo?: OAuthUserInfo 
    error?: string 
  }> {
    try {
      switch (provider) {
        case 'wechat':
          return await this.getWechatUserInfo(accessToken)
        case 'alipay':
          return await this.getAlipayUserInfo(accessToken)
        default:
          return { success: false, error: '不支持的登录方式' }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '获取用户信息失败' 
      }
    }
  }
  
  /**
   * 获取微信用户信息
   */
  private async getWechatUserInfo(accessToken: string): Promise<{ 
    success: boolean 
    userInfo?: OAuthUserInfo 
    error?: string 
  }> {
    const params = new URLSearchParams({
      access_token: accessToken,
      openid: 'mock_openid', // 实际需要从令牌交换响应中获取
      lang: 'zh_CN'
    })
    
    const response = await fetch(`${wechatConfig.userInfoUrl}?${params.toString()}`)
    const data = await response.json()
    
    if (data.errcode) {
      return { success: false, error: `获取微信用户信息失败: ${data.errmsg}` }
    }
    
    return {
      success: true,
      userInfo: {
        provider: 'wechat',
        providerId: data.openid,
        username: data.nickname,
        avatar: data.headimgurl,
        email: '', // 微信不提供邮箱
        rawData: data
      }
    }
  }
  
  /**
   * 获取支付宝用户信息
   */
  private async getAlipayUserInfo(accessToken: string): Promise<{ 
    success: boolean 
    userInfo?: OAuthUserInfo 
    error?: string 
  }> {
    // TODO: 实现支付宝用户信息获取
    // 这里返回模拟数据
    return {
      success: true,
      userInfo: {
        provider: 'alipay',
        providerId: 'mock_alipay_user_id',
        username: '支付宝用户',
        avatar: '',
        email: '',
        rawData: {}
      }
    }
  }
  
  /**
   * 创建或更新用户
   */
  private async createOrUpdateUser(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    accessToken: string,
    refreshToken?: string
  ): Promise<{ 
    success: boolean 
    user?: any 
    token?: string 
    error?: string 
  }> {
    try {
      // 查找是否已存在绑定账户
      const { data: existingOAuth } = await ensureSupabase()
        .from('user_oauth_accounts')
        .select('user_id, users(*)')
        .eq('provider', provider)
        .eq('provider_user_id', userInfo.providerId)
        .single()
      
      let user: any
      
      if (existingOAuth) {
        // 用户已存在，更新OAuth信息
        user = existingOAuth.users
        
        await ensureSupabase()
          .from('user_oauth_accounts')
          .update({
            access_token: accessToken,
            refresh_token: refreshToken,
            provider_data: userInfo.rawData,
            updated_at: new Date().toISOString()
          })
          .eq('provider', provider)
          .eq('provider_user_id', userInfo.providerId)
          
      } else {
        // 创建新用户
        const { data: newUser, error: userError } = await ensureSupabase()
          .from('users')
          .insert({
            nickname: userInfo.username,
            avatar_url: userInfo.avatar,
            email: userInfo.email || null,
            points: 30, // 新用户赠送30点
            is_active: true
          })
          .select()
          .single()
        
        if (userError) {
          throw new Error(`创建用户失败: ${userError.message}`)
        }
        
        user = newUser
        
        // 创建OAuth绑定记录
        await ensureSupabase()
          .from('user_oauth_accounts')
          .insert({
            user_id: user.id,
            provider,
            provider_user_id: userInfo.providerId,
            provider_username: userInfo.username,
            provider_email: userInfo.email,
            provider_avatar: userInfo.avatar,
            access_token: accessToken,
            refresh_token: refreshToken,
            provider_data: userInfo.rawData,
            is_verified: true,
            is_primary: true
          })
      }
      
      // 生成JWT令牌
      const token = await this.generateUserToken(user)
      
      return { success: true, user, token }
      
    } catch (error) {
      console.error('创建或更新用户失败:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '用户处理失败' 
      }
    }
  }
  
  /**
   * 生成用户JWT令牌
   */
  private async generateUserToken(user: any): Promise<string> {
    // TODO: 实现JWT令牌生成
    // 这里返回模拟令牌
    return `jwt_token_${user.id}_${Date.now()}`
  }
  
  /**
   * 记录登录历史
   */
  private async recordLoginHistory(
    userId: string | null,
    loginMethod: string,
    isSuccessful: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await ensureSupabase()
        .from('user_login_history')
        .insert({
          user_id: userId,
          login_method: loginMethod,
          is_successful: isSuccessful,
          failure_reason: failureReason,
          device_info: {},
          location_info: {}
        })
    } catch (error) {
      console.error('记录登录历史失败:', error)
    }
  }
  
  /**
   * 绑定第三方账户到现有用户
   */
  async bindOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    accessToken: string,
    refreshToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 检查是否已绑定
      const { data: existing } = await ensureSupabase()
        .from('user_oauth_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('provider', provider)
        .single()
      
      if (existing) {
        return { success: false, error: '该账户已绑定此登录方式' }
      }
      
      // 检查第三方账户是否已被其他用户使用
      const { data: usedByOther } = await ensureSupabase()
        .from('user_oauth_accounts')
        .select('user_id')
        .eq('provider', provider)
        .eq('provider_user_id', userInfo.providerId)
        .single()
      
      if (usedByOther) {
        return { success: false, error: '该第三方账户已被其他用户绑定' }
      }
      
      // 创建绑定记录
      const { error } = await ensureSupabase()
        .from('user_oauth_accounts')
        .insert({
          user_id: userId,
          provider,
          provider_user_id: userInfo.providerId,
          provider_username: userInfo.username,
          provider_email: userInfo.email,
          provider_avatar: userInfo.avatar,
          access_token: accessToken,
          refresh_token: refreshToken,
          provider_data: userInfo.rawData,
          is_verified: true,
          is_primary: false
        })
      
      if (error) {
        throw new Error(`绑定账户失败: ${error.message}`)
      }
      
      return { success: true }
      
    } catch (error) {
      console.error('绑定OAuth账户失败:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '绑定账户失败' 
      }
    }
  }
  
  /**
   * 解绑第三方账户
   */
  async unbindOAuthAccount(
    userId: string,
    provider: OAuthProvider
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 检查是否为主要登录方式
      const { data: account } = await ensureSupabase()
        .from('user_oauth_accounts')
        .select('is_primary')
        .eq('user_id', userId)
        .eq('provider', provider)
        .single()
      
      if (!account) {
        return { success: false, error: '未找到绑定的账户' }
      }
      
      // 检查用户是否还有其他登录方式
      const { data: allAccounts } = await ensureSupabase()
        .from('user_oauth_accounts')
        .select('provider')
        .eq('user_id', userId)
      
      const { data: user } = await ensureSupabase()
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single()
      
      const hasPhone = user?.phone
      const hasOtherOAuth = allAccounts && allAccounts.length > 1
      
      if (!hasPhone && !hasOtherOAuth) {
        return { success: false, error: '至少需要保留一种登录方式' }
      }
      
      // 删除绑定记录
      const { error } = await ensureSupabase()
        .from('user_oauth_accounts')
        .delete()
        .eq('user_id', userId)
        .eq('provider', provider)
      
      if (error) {
        throw new Error(`解绑账户失败: ${error.message}`)
      }
      
      return { success: true }
      
    } catch (error) {
      console.error('解绑OAuth账户失败:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '解绑账户失败' 
      }
    }
  }
}

// 创建单例实例
export const oauthService = new OAuthService() 