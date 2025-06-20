'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import LoginForm from '../components/LoginForm'

export default function Login() {
  const searchParams = useSearchParams()

  // 处理URL中的错误参数
  useEffect(() => {
    const error = searchParams?.get('error')
    if (error) {
      toast.error(decodeURIComponent(error))
    }
  }, [searchParams])

  // 确保页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full py-6 px-4">
        
        {/* Hero Section - 顶部标题区 */}
        <section className="flex flex-col items-center justify-center text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              欢迎加入
            </h1>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed mb-3 px-2">
            开启你的AI创作之旅 - 18种专业风格，中文智能优化，让创意无限绽放
          </p>
          <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-900/20 px-3 py-2 rounded-full border border-orange-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            注册即获 10 点免费生成点数
          </div>
        </section>

        {/* 登录表单容器 */}
        <div className="flex justify-center items-start">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

