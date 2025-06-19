import { NextRequest, NextResponse } from 'next/server'
import { oauthService } from '@/app/lib/auth/oauthService'
import { OAuthProvider } from '@/app/lib/auth/types'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await context.params
    const oauthProvider = provider as OAuthProvider
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // 检查是否有错误
    if (error) {
      const errorDescription = searchParams.get('error_description') || error
      console.error(`OAuth ${oauthProvider} 授权失败:`, errorDescription)
      
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(`${oauthProvider}登录失败: ${errorDescription}`)}`, request.url)
      )
    }
    
    // 检查必需参数
    if (!code || !state) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('授权参数缺失')}`, request.url)
      )
    }
    
    // 验证provider是否支持
    const supportedProviders: OAuthProvider[] = ['wechat', 'alipay']
    if (!supportedProviders.includes(oauthProvider)) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('不支持的登录方式')}`, request.url)
      )
    }
    
    // 处理OAuth回调
    const result = await oauthService.handleCallback(oauthProvider, code, state)
    
    if (!result.success) {
      console.error(`OAuth ${oauthProvider} 回调处理失败:`, result.error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(result.error || '登录失败')}`, request.url)
      )
    }
    
    // 登录成功，设置会话
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // 设置认证cookie
    if (result.token) {
      response.cookies.set('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        path: '/'
      })
    }
    
    // 设置用户信息cookie
    if (result.user) {
      response.cookies.set('user_info', JSON.stringify({
        id: result.user.id,
        nickname: result.user.nickname,
        avatar_url: result.user.avatar_url
      }), {
        httpOnly: false, // 允许前端访问
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        path: '/'
      })
    }
    
    return response
    
  } catch (error) {
    console.error('OAuth回调处理异常:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('登录过程中发生错误')}`, request.url)
    )
  }
}

// 处理POST请求（某些OAuth提供商可能使用POST回调）
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await context.params
    const oauthProvider = provider as OAuthProvider
    const body = await request.json()
    
    // 获取授权码和状态
    const { code, state, auth_code } = body
    const authCode = code || auth_code
    
    if (!authCode || !state) {
      return NextResponse.json(
        { success: false, error: '授权参数缺失' },
        { status: 400 }
      )
    }
    
    // 验证provider是否支持
    const supportedProviders: OAuthProvider[] = ['wechat', 'alipay']
    if (!supportedProviders.includes(oauthProvider)) {
      return NextResponse.json(
        { success: false, error: '不支持的登录方式' },
        { status: 400 }
      )
    }
    
    // 处理OAuth回调
    const result = await oauthService.handleCallback(oauthProvider, authCode, state)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || '登录失败' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: result.user,
        token: result.token
      }
    })
    
  } catch (error) {
    console.error('OAuth POST回调处理异常:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '登录过程中发生错误' 
      },
      { status: 500 }
    )
  }
} 