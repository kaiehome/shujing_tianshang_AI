import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../lib/auth/authService'

// PUT /api/auth/profile - 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    // 获取认证token
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 获取当前用户
    const currentUser = await authService.getCurrentUser(authToken)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在或令牌无效' },
        { status: 401 }
      )
    }

    // 获取更新数据
    const body = await request.json()
    const { nickname, gender, birthday, location, bio, preferences } = body

    // 构建更新对象
    const updates: any = {}
    if (nickname !== undefined) updates.nickname = nickname
    if (gender !== undefined) updates.gender = gender
    if (birthday !== undefined) updates.birthday = birthday
    if (location !== undefined) updates.location = location
    if (bio !== undefined) updates.bio = bio
    if (preferences !== undefined) updates.preferences = preferences

    // 更新用户资料
    const result = await authService.updateUserProfile(currentUser.id, updates)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '用户资料更新成功'
    })

  } catch (error) {
    console.error('更新用户资料失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 