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
    const redirectUri = searchParams.get('redirect_uri') || undefined
    
    // 验证provider是否支持
    const supportedProviders: OAuthProvider[] = ['wechat', 'alipay']
    if (!supportedProviders.includes(oauthProvider)) {
      return NextResponse.json(
        { success: false, error: '不支持的登录方式' },
        { status: 400 }
      )
    }
    
    // 生成授权URL
    const result = await oauthService.generateAuthUrl(oauthProvider, redirectUri)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
    
    // 重定向到第三方授权页面
    return NextResponse.redirect(result.authUrl!)
    
  } catch (error) {
    console.error('OAuth启动失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'OAuth启动失败' 
      },
      { status: 500 }
    )
  }
} 