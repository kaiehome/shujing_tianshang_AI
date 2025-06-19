import { NextRequest, NextResponse } from 'next/server'
import { authService } from '../../../../lib/auth/authService'

// GET /api/auth/alipay/url - 获取支付宝授权URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectUri = searchParams.get('redirect_uri')

    // 生成支付宝授权URL
    const authUrl = authService.getAlipayAuthUrl(redirectUri || undefined)

    return NextResponse.json({
      success: true,
      data: {
        auth_url: authUrl
      }
    })

  } catch (error) {
    console.error('获取支付宝授权URL失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 