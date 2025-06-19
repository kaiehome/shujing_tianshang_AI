'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              给我留言
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            遇到问题？有建议？想要合作？我们很乐意听到您的声音！
          </p>
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm3.707-5.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            24小时内快速回复
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 联系表单 */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              发送消息
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">消息发送成功！</h3>
                <p className="text-gray-300 mb-4">感谢您的反馈，我们会尽快回复您。</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-green-500 transition-all duration-300"
                >
                  发送另一条消息
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    主题 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">请选择主题</option>
                    <option value="bug">🐛 报告Bug</option>
                    <option value="feature">💡 功能建议</option>
                    <option value="support">🤝 技术支持</option>
                    <option value="cooperation">🤝 商务合作</option>
                    <option value="feedback">💬 使用反馈</option>
                    <option value="other">❓ 其他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    详细描述 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="请详细描述您的问题、建议或想法..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-cyan-500 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      发送中...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      发送消息
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* 联系信息和其他方式 */}
          <div className="space-y-6">
            {/* 联系信息 */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                其他联系方式
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-900/30 rounded-lg">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="text-gray-300 text-sm">邮箱</div>
                    <div className="text-white">support@huayaspace.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-zinc-900/30 rounded-lg">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <div className="text-gray-300 text-sm">响应时间</div>
                    <div className="text-white">24小时内回复</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 常见问题快速链接 */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span className="text-xl">❓</span>
                常见问题
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                在联系我们之前，您可以先查看常见问题解答，可能会找到您需要的答案。
              </p>
              <Link 
                href={getLocalizedPath('/faq', currentLocale)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
              >
                📋 查看常见问题
              </Link>
            </div>

            {/* 服务承诺 */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span className="text-xl">🌟</span>
                服务承诺
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                我们致力于为每位用户提供优质的AI图像生成服务和支持。
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                  <span className="text-lg">🚀</span>
                  <div>
                    <div className="text-purple-200 text-sm font-medium">持续优化</div>
                    <div className="text-purple-300 text-xs">不断改进功能和用户体验</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                  <span className="text-lg">🔒</span>
                  <div>
                    <div className="text-purple-200 text-sm font-medium">隐私保护</div>
                    <div className="text-purple-300 text-xs">严格保护用户数据和隐私安全</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                  <span className="text-lg">💎</span>
                  <div>
                    <div className="text-purple-200 text-sm font-medium">专业品质</div>
                    <div className="text-purple-300 text-xs">提供高质量的AI图像生成服务</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 版权声明 */}
        <div className="mt-8 p-6 bg-zinc-900/30 rounded-xl border border-zinc-600/20 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Artbud Space (artbud.space). 保留所有权利。
          </p>
          <p className="text-gray-500 text-xs mt-2">
            期待您的每一条反馈，让我们一起打造更好的创作工具
          </p>
        </div>

        {/* 返回首页按钮 */}
        <div className="text-center mt-12">
          <Link
            href={getLocalizedPath('/', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 