'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function LoginForm() {
  const pathname = usePathname()
  const { locale: currentLocale } = useTranslations()

  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState({
    phone: false,
    verification: false,
    wechat: false,
    alipay: false
  })
  const [error, setError] = useState('')

  const { sendSmsCode, loginWithPhone, loginWithWechat, loginWithAlipay, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // 获取返回URL
  const returnUrl = searchParams.get('returnUrl') || '/'

  // 如果已登录，重定向到返回URL或首页
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl)
    }
  }, [isAuthenticated, router, returnUrl])

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone) {
      setError('请输入手机号')
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号格式')
      return
    }

    setIsLoading(prev => ({ ...prev, phone: true }))
    setError('')

    try {
      const result = await sendSmsCode(phone, 'login')
      
      if (result.success) {
        setIsCodeSent(true)
        setCountdown(60)
        toast.success('验证码发送成功')
      } else {
        setError(result.error || '发送验证码失败，请重试')
        toast.error(result.error || '发送验证码失败')
      }
    } catch (error) {
      setError('发送验证码失败，请重试')
      toast.error('发送验证码失败')
    } finally {
      setIsLoading(prev => ({ ...prev, phone: false }))
    }
  }

  // 手机验证码登录
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || !verificationCode) {
      setError('请输入手机号和验证码')
      return
    }

    setIsLoading(prev => ({ ...prev, verification: true }))
    setError('')

    try {
      const result = await loginWithPhone(phone, verificationCode)
      
      if (result.success) {
        toast.success('登录成功')
        router.push(returnUrl)
      } else {
        setError(result.error || '登录失败，请重试')
        toast.error(result.error || '登录失败')
      }
    } catch (error) {
      setError('登录过程中出现错误，请重试')
      toast.error('登录失败')
    } finally {
      setIsLoading(prev => ({ ...prev, verification: false }))
    }
  }

  // 微信登录
  const handleWechatLogin = async () => {
    setIsLoading(prev => ({ ...prev, wechat: true }))
    setError('')

    try {
      const result = await loginWithWechat()
      
      if (!result.success) {
        setError(result.error || '微信登录失败')
        toast.error(result.error || '微信登录失败')
      }
    } catch (error) {
      setError('微信登录过程中出现错误')
      toast.error('微信登录失败')
    } finally {
      setIsLoading(prev => ({ ...prev, wechat: false }))
    }
  }

  // 支付宝登录
  const handleAlipayLogin = async () => {
    setIsLoading(prev => ({ ...prev, alipay: true }))
    setError('')

    try {
      const result = await loginWithAlipay()
      
      if (!result.success) {
        setError(result.error || '支付宝登录失败')
        toast.error(result.error || '支付宝登录失败')
      }
    } catch (error) {
      setError('支付宝登录过程中出现错误')
      toast.error('支付宝登录失败')
    } finally {
      setIsLoading(prev => ({ ...prev, alipay: false }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-zinc-600/30 shadow-2xl">
        
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            登录账户
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            选择登录方式，继续你的创作旅程
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 第三方登录 */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleWechatLogin}
            disabled={isLoading.wechat}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
          >
            {isLoading.wechat ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-lg">💬</span>
            )}
            微信登录
          </button>

          <button
            onClick={handleAlipayLogin}
            disabled={isLoading.alipay}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
          >
            {isLoading.alipay ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-lg">💰</span>
            )}
            支付宝登录
          </button>
        </div>

        {/* 分割线 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-800 text-gray-400">或使用手机号登录</span>
          </div>
        </div>

        {/* 手机号登录表单 */}
        <form onSubmit={handlePhoneLogin} className="space-y-4">
          {/* 手机号输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              手机号
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              maxLength={11}
            />
          </div>

          {/* 验证码输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              验证码
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading.phone || countdown > 0}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                {isLoading.phone ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  isCodeSent ? '重新发送' : '发送验证码'
                )}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading.verification || !phone || !verificationCode}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading.verification ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* 用户协议 */}
        <div className="mt-6 text-center text-xs text-gray-400">
          登录即表示您同意我们的
          <a href={getLocalizedPath('/terms', currentLocale)} className="text-blue-400 hover:text-blue-300 transition-colors">
            用户协议
          </a>
          、
          <a href={getLocalizedPath('/usage-terms', currentLocale)} className="text-blue-400 hover:text-blue-300 transition-colors">
            使用条款
          </a>
          和
          <a href={getLocalizedPath('/privacy', currentLocale)} className="text-blue-400 hover:text-blue-300 transition-colors">
            隐私政策
          </a>
        </div>
      </div>
    </div>
  )
} 