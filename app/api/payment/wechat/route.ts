import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan')
  const cycle = searchParams.get('cycle')

  // 这里添加实际的微信支付逻辑
  // 1. 调用微信支付 API 创建订单
  // 2. 获取支付二维码
  // 3. 返回支付二维码页面

  // 示例：返回支付二维码页面
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `weixin://wxpay/bizpayurl?pr=${Date.now()}`
  )}`

  return NextResponse.json({
    qrCodeUrl,
    orderInfo: {
      plan,
      cycle,
      amount: plan === 'pro' ? (cycle === 'yearly' ? '120' : '12') : (cycle === 'yearly' ? '240' : '24'),
      subject: `${plan === 'pro' ? '高级版' : '全能版'} - ${cycle === 'yearly' ? '年付' : '月付'}`
    }
  })
} 