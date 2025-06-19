import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../lib/auth/authService'

// GET /api/auth/me - 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    // 获取认证token
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 获取用户信息
    const user = await authService.getCurrentUser(authToken)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在或令牌无效' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          phone: user.phone,
          email: user.email,
          provider: user.provider,
          created_at: user.created_at,
          last_login: user.last_login,
          profile: user.profile
        }
      }
    })

  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 