'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface WechatPaymentData {
  success: boolean;
  qrCodeUrl?: string;
  orderId?: string;
  orderInfo?: {
    subject: string;
    amount: string;
    description: string;
  };
  message?: string;
}

export default function WechatPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<WechatPaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(600) // 10分钟倒计时

  useEffect(() => {
    // 获取支付参数
    const plan = searchParams?.get('plan')
    const cycle = searchParams?.get('cycle')
    const packageId = searchParams?.get('package')

    // 构建参数字符串
    const params = new URLSearchParams()
    if (packageId) params.set('package', packageId)
    if (plan) params.set('plan', plan)
    if (cycle) params.set('cycle', cycle)

    // 调用微信支付API
    fetch(`/api/payment/wechat?${params}`)
      .then(response => response.json())
      .then((data: WechatPaymentData) => {
        setPaymentData(data)
        setLoading(false)
        
        if (!data.success) {
          setError(data.message || '创建支付失败')
        }
      })
      .catch(err => {
        console.error('获取微信支付信息失败:', err)
        setError('网络错误，请重试')
        setLoading(false)
      })
  }, [searchParams])

  // 倒计时效果
  useEffect(() => {
    if (!paymentData?.success) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/payment/error?message=支付超时，请重新发起支付')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentData, router])

  // 格式化倒计时
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">正在创建微信支付...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentData?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-zinc-700/50">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">支付创建失败</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              重试
            </button>
            <button
              onClick={handleGoBack}
              className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-zinc-700/50">
        {/* 微信图标 */}
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">微</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">微信扫码支付</h1>
        <p className="text-gray-400 mb-6">请使用微信扫描下方二维码完成支付</p>

        {/* 订单信息 */}
        {paymentData.orderInfo && (
          <div className="bg-zinc-700/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">订单信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">商品：</span>
                <span className="text-gray-300">{paymentData.orderInfo.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">订单号：</span>
                <span className="text-gray-300 font-mono text-xs">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">金额：</span>
                <span className="text-green-400 font-semibold">¥{(parseInt(paymentData.orderInfo.amount) / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 二维码 */}
        <div className="bg-white p-6 rounded-xl mb-6 mx-auto w-fit">
          {paymentData.qrCodeUrl ? (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData.qrCodeUrl)}`}
              alt="微信支付二维码"
              className="w-48 h-48"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">二维码加载中...</span>
            </div>
          )}
        </div>

        {/* 倒计时 */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-green-300 text-sm mb-1">⏱️ 支付剩余时间</p>
          <p className="text-green-400 font-bold text-xl">{formatCountdown(countdown)}</p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            刷新二维码
          </button>
          <button
            onClick={handleGoBack}
            className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300"
          >
            返回支付选择
          </button>
        </div>

        {/* 支付说明 */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 请使用微信&quot;扫一扫&quot;功能扫描二维码完成支付
          </p>
        </div>
      </div>
    </div>
  )
} 