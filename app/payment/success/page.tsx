'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OrderInfo {
  orderId?: string
  paymentMethod?: string
  amount?: string
  productName?: string
  productType?: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({})

  useEffect(() => {
    // 获取订单信息
    const orderId = searchParams?.get('order_id')
    const paymentId = searchParams?.get('payment_id') 
    const sessionId = searchParams?.get('session_id')
    const out_trade_no = searchParams?.get('out_trade_no') // 支付宝回调参数
    const total_amount = searchParams?.get('total_amount') // 支付宝回调参数
    const trade_no = searchParams?.get('trade_no') // 支付宝交易号
    const transaction_id = searchParams?.get('transaction_id') // 微信交易号
    const total_fee = searchParams?.get('total_fee') // 微信支付金额(分)

    // 设置订单信息
    setOrderInfo({
      orderId: orderId || out_trade_no || paymentId || sessionId || '',
      paymentMethod: trade_no ? 'alipay' : transaction_id ? 'wechat' : sessionId ? 'stripe' : 'unknown',
      amount: total_amount || (total_fee ? (parseInt(total_fee) / 100).toString() : ''),
      productType: 'subscription' // 根据实际情况确定
    })
    
    // 只有在包含支付参数时才设置自动跳转
    if (orderId || paymentId || sessionId || out_trade_no) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      // 如果是直接访问或刷新，不设置自动跳转
      setCountdown(0)
    }
  }, [router, searchParams])

  const handleGoHome = () => {
    router.push('/')
  }

  const handleViewMyAccount = () => {
    router.push('/my-works')
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'alipay':
        return '支付宝'
      case 'wechat':
        return '微信支付'
      case 'stripe':
        return 'Stripe'
      default:
        return '在线支付'
    }
  }

  const getBenefits = (productType: string) => {
    if (productType === 'package') {
      return [
        '✨ 点数已充值到账户',
        '🎨 可用于AI图像生成', 
        '⚡ 立即开始创作',
        '💾 作品永久保存'
      ]
    } else {
      return [
        '✨ 无限制AI图像生成',
        '🎨 专业风格模板库',
        '⚡ 优先处理队列',
        '💎 高清图像导出'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-zinc-700/50">
          {/* 成功图标 */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            支付成功！
          </h1>

          {/* 订单信息 */}
          {orderInfo.orderId && (
            <div className="bg-zinc-700/30 rounded-lg p-4 mb-6 border border-zinc-600/30">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">订单详情</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">订单号：</span>
                  <span className="text-gray-300 font-mono text-xs">{orderInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">支付方式：</span>
                  <span className="text-gray-300">{getPaymentMethodName(orderInfo.paymentMethod || '')}</span>
                </div>
                {orderInfo.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">支付金额：</span>
                    <span className="text-green-400 font-semibold">¥{orderInfo.amount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-300 text-lg">
              🎉 恭喜您！购买成功！
            </p>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-300 font-medium mb-2">您已获得：</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {getBenefits(orderInfo.productType || 'subscription').map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              立即开始创作 🚀
            </button>

            <button
              onClick={handleViewMyAccount}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 border border-blue-400/30"
            >
              查看我的账户 📊
            </button>
            
            {countdown > 0 && (
              <p className="text-gray-400 text-sm">
                {countdown} 秒后自动跳转到首页...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 