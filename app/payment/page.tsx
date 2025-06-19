'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PRICING_CONFIG, type BillingCycle } from '../lib/pricingConfig';

type PaymentMethod = 'alipay' | 'wechat' | 'stripe'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const plan = searchParams?.get('plan') || 'pro' // 'pro' or 'ultimate'
  const billingCycle = searchParams?.get('cycle') as BillingCycle || 'monthly' // 'monthly' or 'yearly'
  const packageId = searchParams?.get('package') // 点数包ID
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay') // Default to alipay
  const [isChinaUser, setIsChinaUser] = useState(true); // Placeholder: assume China user by default

  // 点数包配置
  const pointPackages = {
    '30': { points: '30 点', price: '¥9', description: '生成 30 次图像（每次4图）' },
    '100': { points: '100 点', price: '¥27', description: '生成 100 次图像' },
    '300': { points: '300 点', price: '¥66', description: '生成 300 次图像' }
  }

  useEffect(() => {
    // TODO: Implement actual logic to determine if the user is in mainland China
    // For example, based on IP address, browser language, or authenticated user data.
    // const userLocation = ... // Get user location
    // setIsChinaUser(userLocation === 'China');

    // Set initial payment method based on location
    if (!isChinaUser) {
      setPaymentMethod('stripe'); // Default to Stripe for international users
    }

  }, [isChinaUser]); // Re-run if isChinaUser changes (though it should be set once based on initial detection)

  const isPointPackage = !!packageId
  const currentPackage = packageId ? pointPackages[packageId as keyof typeof pointPackages] : null

  const getPrice = () => {
    if (isPointPackage && currentPackage) {
      return currentPackage.price
    }
    // Use PRICING_CONFIG from the shared file
    const price = PRICING_CONFIG[billingCycle][plan as 'pro' | 'ultimate'];
    return `$${price}`;
  }

  const getProductName = () => {
    if (isPointPackage && currentPackage) {
      return currentPackage.points
    }
    return plan === 'pro' ? '高级版' : '全能版'
  }

  const getDescription = () => {
    if (isPointPackage && currentPackage) {
      return currentPackage.description
    }
    return `计费周期：${billingCycle === 'yearly' ? '年付' : '月付'}`
  }

  const handlePayment = () => {
    // Here we will direct to the appropriate API route based on selected method and location
    const baseParams = isPointPackage 
      ? `package=${packageId}` 
      : `plan=${plan}&cycle=${billingCycle}`
    
    if (isChinaUser) {
      if (paymentMethod === 'alipay') {
        window.location.href = `/api/payment/alipay?${baseParams}`;
      } else if (paymentMethod === 'wechat') {
        window.location.href = `/payment/wechat?${baseParams}`;
      }
    } else {
       if (paymentMethod === 'stripe') {
         window.location.href = `/api/payment/stripe?${baseParams}`;
       }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {isPointPackage ? '购买点数包' : '选择支付方式'}
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">订单信息</h2>
            <div className="bg-zinc-700/50 p-6 rounded-xl border border-zinc-600/30">
              <p className="text-gray-300 mb-2">
                {isPointPackage ? '点数包' : '套餐'}：{getProductName()}
              </p>
              <p className="text-gray-300 mb-4">
                {getDescription()}
              </p>
              <p className="text-2xl font-bold text-blue-400">
                支付金额：{getPrice()}{isPointPackage ? '' : '/月'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">选择支付方式</h2>
            <div className="space-y-4">
              {isChinaUser ? (
                // China Payment Options
                <>
                  <button
                    onClick={() => setPaymentMethod('alipay')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 transition-all duration-200 ${
                      paymentMethod === 'alipay'
                        ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                        : 'border-zinc-600 hover:border-blue-400/70 bg-zinc-700/30'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">支</span>
                    </div>
                    <span className="text-lg text-white">支付宝支付</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('wechat')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 transition-all duration-200 ${
                      paymentMethod === 'wechat'
                        ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/30'
                        : 'border-zinc-600 hover:border-green-400/70 bg-zinc-700/30'
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">微</span>
                    </div>
                    <span className="text-lg text-white">微信支付</span>
                  </button>
                </>
              ) : (
                // International Payment Options
                <>
                   <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 transition-all duration-200 ${
                      paymentMethod === 'stripe'
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                        : 'border-zinc-600 hover:border-indigo-400/70 bg-zinc-700/30'
                    }`}
                  >
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <span className="text-lg text-white">Stripe支付</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
          >
            确认支付
          </button>

          {/* 返回按钮 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ← 返回上一页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 