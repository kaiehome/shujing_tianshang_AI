import { NextRequest, NextResponse } from 'next/server'
import { handleAlipayCallback } from '../../../../lib/payment/alipayService'

export async function POST(request: NextRequest) {
  try {
    // 获取支付宝回调数据
    const formData = await request.formData()
    const params: Record<string, string> = {}
    
    // 转换FormData为普通对象
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString()
    }

    console.log('收到支付宝回调:', params)

    // 处理回调
    const result = await handleAlipayCallback(params)

    if (result.success) {
      // 支付成功，返回success给支付宝
      return new NextResponse('success', { status: 200 })
    } else {
      // 支付失败或其他状态
      return new NextResponse('failure', { status: 400 })
    }

  } catch (error) {
    console.error('处理支付宝回调失败:', error)
    
    // 返回failure给支付宝，支付宝会重试
    return new NextResponse('failure', { status: 500 })
  }
}

// 支持GET请求用于测试
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}
  
  // 转换URLSearchParams为普通对象
  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }

  try {
    console.log('收到支付宝回调(GET):', params)
    
    const result = await handleAlipayCallback(params)
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data
    })

  } catch (error) {
    console.error('处理支付宝回调失败:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : '处理回调失败'
    }, { status: 500 })
  }
} 