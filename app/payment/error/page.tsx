'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('支付过程中出现错误')

  useEffect(() => {
    const message = searchParams?.get('message')
    if (message) {
      setErrorMessage(decodeURIComponent(message))
    }
  }, [searchParams])

  const handleRetry = () => {
    router.push('/pricing')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleContactSupport = () => {
    router.push('/contact')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-zinc-700/50">
          {/* 错误图标 */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            支付失败
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-300 text-lg">
              😅 很抱歉，支付过程中出现了问题
            </p>
            
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
              <p className="text-red-300 font-medium mb-2">错误信息：</p>
              <p className="text-sm text-gray-300">{errorMessage}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-300 font-medium mb-2">可能的原因：</p>
              <ul className="text-sm text-gray-300 space-y-1 text-left">
                <li>• 网络连接不稳定</li>
                <li>• 支付信息填写有误</li>
                <li>• 银行卡余额不足</li>
                <li>• 支付系统暂时维护</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              重新支付 💳
            </button>

            <button
              onClick={handleContactSupport}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 border border-green-400/30"
            >
              联系客服 🔧
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300"
            >
              返回首页 🏠
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-sm">
              💡 如果问题持续存在，请联系我们的客服团队获得帮助
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 