import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../lib/auth/authService'

// POST /api/auth/logout - 用户登出
export async function POST(request: NextRequest) {
  try {
    // 获取认证token
    const authToken = request.cookies.get('auth_token')?.value

    if (authToken) {
      // 执行登出操作
      await authService.logout(authToken)
    }

    // 创建响应并清除cookies
    const response = NextResponse.json({
      success: true,
      message: '登出成功'
    })

    // 清除认证相关的cookies
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('登出失败:', error)
    
    // 即使出错也清除cookies
    const response = NextResponse.json({
      success: true,
      message: '登出成功'
    })

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
  }
} 