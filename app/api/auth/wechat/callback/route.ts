import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../../lib/auth/authService'

// GET /api/auth/wechat/callback - 微信授权回调
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    // 参数验证
    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=微信授权失败，缺少授权码', request.url)
      )
    }

    // 处理微信登录
    const result = await authService.loginWithWechat(code, state || undefined)
    
    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(result.error?.message || '微信登录失败')}`, request.url)
      )
    }

    // 创建重定向响应
    const redirectUrl = result.redirect_url || '/'
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))

    // 设置认证cookie
    if (result.session) {
      response.cookies.set('auth_token', result.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7天
      })

      if (result.session.refresh_token) {
        response.cookies.set('refresh_token', result.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 // 30天
        })
      }
    }

    return response

  } catch (error) {
    console.error('微信授权回调失败:', error)
    return NextResponse.redirect(
      new URL('/login?error=微信登录过程中出现错误', request.url)
    )
  }
} 