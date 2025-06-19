import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../../lib/auth/authService'
import { validatePhone, validateSmsCode } from '../../../../lib/auth/utils'

// POST /api/auth/login/phone - 手机验证码登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, code } = body

    // 参数验证
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码不能为空' },
        { status: 400 }
      )
    }

    // 手机号格式验证
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: 400 }
      )
    }

    // 验证码格式验证
    const codeValidation = validateSmsCode(code)
    if (!codeValidation.isValid) {
      return NextResponse.json(
        { success: false, error: codeValidation.error },
        { status: 400 }
      )
    }

    // 执行登录
    const result = await authService.loginWithPhone(phone, code)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error?.message || '登录失败' 
        },
        { status: 401 }
      )
    }

    // 设置认证cookie
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: result.user?.id,
          name: result.user?.name,
          avatar: result.user?.avatar,
          phone: result.user?.phone,
          provider: result.user?.provider
        },
        expires_at: result.session?.expires_at
      }
    })

    // 设置HTTP-only cookie
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
    console.error('手机登录失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 