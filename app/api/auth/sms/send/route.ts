import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../../lib/auth/authService'
import { validatePhone } from '../../../../lib/auth/utils'

// POST /api/auth/sms/send - 发送短信验证码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, type = 'login' } = body

    // 参数验证
    if (!phone) {
      return NextResponse.json(
        { success: false, error: '手机号不能为空' },
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

    // 验证类型
    const validTypes = ['login', 'register', 'reset_password', 'bind_phone']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: '无效的验证码类型' },
        { status: 400 }
      )
    }

    // 发送验证码
    const result = await authService.sendSmsCode(phone, type)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '验证码发送成功',
      data: {
        phone: `${phone.slice(0, 3)}****${phone.slice(-4)}`,
        expires_in: 300 // 5分钟
      }
    })

  } catch (error) {
    console.error('发送短信验证码失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 