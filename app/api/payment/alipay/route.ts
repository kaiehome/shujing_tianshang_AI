import { NextRequest, NextResponse } from 'next/server'
import { createOrderInfo, createAlipayPayment } from '../../../lib/payment/alipayService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取参数
    const plan = searchParams.get('plan')
    const cycle = searchParams.get('cycle')
    const packageId = searchParams.get('package')
    
    // TODO: 获取用户ID（从JWT token或session中）
    const userId = 'anonymous' // 临时值，实际应该从认证中获取

    // 创建订单信息
    const orderInfo = createOrderInfo({
      package: packageId || undefined,
      plan: plan || undefined,
      cycle: cycle || undefined,
      userId
    })

    console.log('创建支付宝订单:', orderInfo)

    // 创建支付链接
    const paymentUrl = await createAlipayPayment(orderInfo)

    // TODO: 将订单信息保存到数据库
    // await saveOrderToDatabase(orderInfo)

    // 重定向到支付宝支付页面
    return NextResponse.redirect(paymentUrl)

  } catch (error) {
    console.error('支付宝支付创建失败:', error)
    
    // 返回错误页面
    const errorUrl = new URL('/payment/error', request.url)
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : '创建支付失败')
    
    return NextResponse.redirect(errorUrl)
  }
} 