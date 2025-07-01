'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '../hooks/useTranslations'

export default function FAQPage() {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { t, locale } = useTranslations()

  // 检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error('检查用户状态失败:', error)
      }
    }
    
    checkAuthStatus()
  }, [])

  // 处理"我的作品"点击
  const handleMyWorksClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      // 访客用户，显示注册提示
      const alertMessage = currentLocale === 'zh' 
        ? '请先注册登录后查看您的作品历史' 
        : 'Please register and login to view your work history'
      alert(alertMessage)
      const loginPath = getLocalizedPath('/login', currentLocale)
      router.push(loginPath)
    } else {
      // 注册用户，跳转到作品页面
      const historyPath = getLocalizedPath('/history', currentLocale)
      router.push(historyPath)
    }
  }

  const faqCategories = t.faq.categories

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto w-full py-8 px-4">
        {/* Hero Section - 标题区 */}
        <section className="flex flex-col items-center justify-center text-center mb-12" id="faq-hero">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t.faq.title}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-4">
            {t.faq.slogan}
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t.faq.categories.reduce((sum, cat) => sum + cat.questions.length, 0)} {t.faq.title}
          </div>
        </section>

        {/* FAQ 分类与问题渲染 */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.faq.categories.map((cat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 p-6 rounded-xl border border-zinc-600/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl ${cat.color}`}>{cat.icon}</span>
                  <span className="text-lg font-bold text-white">{cat.title}</span>
                </div>
                <div className="space-y-4">
                  {cat.questions.map((q, qidx) => (
                    <div key={qidx} className="bg-zinc-800/80 rounded-lg p-4 border border-zinc-700/40">
                      <div className="font-semibold text-blue-400 mb-2">{q.q}</div>
                      <div className="text-gray-300 text-sm whitespace-pre-line">{q.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}