"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [user, setUser] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { t, locale: currentLocale } = useTranslations()

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

  // 监听滚动，决定是否显示回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    
    // 组件挂载时立即检查一次滚动位置
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 监听点击外部区域，自动收起菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsExpanded(false) // 执行操作后收起菜单
  }

  // 给我留言
  const openMessage = () => {
    try {
      const contactPath = getLocalizedPath('/contact', currentLocale)
      router.push(contactPath)
      setIsExpanded(false) // 执行操作后收起菜单
    } catch (error) {
      console.error('Navigation error:', error)
      // 如果路由跳转失败，使用传统方式
      const contactPath = getLocalizedPath('/contact', currentLocale)
      window.location.href = contactPath
    }
  }

  // 我的作品
  const openMyWorks = () => {
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
    setIsExpanded(false)
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 展开的功能按钮 */}
      {isExpanded && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {/* 我的作品 */}
          <button
            onClick={openMyWorks}
            className={`group flex items-center gap-3 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 ${
              user 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-500'
            }`}
            title={user ? t.floatingButton.viewMyWorksTooltip : t.floatingButton.registerTooltip}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap">
              {user ? t.floatingButton.myWorks : t.floatingButton.myWorksLocked}
            </span>
          </button>

          {/* 给我留言 */}
          <button
            onClick={openMessage}
            className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap">
              {t.floatingButton.contactUs}
            </span>
          </button>

          {/* 回到顶部 */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap">
                {t.floatingButton.backToTop}
              </span>
            </button>
          )}
        </div>
      )}

      {/* 主按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        
        {/* 访客提示点 */}
        {!user && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">!</span>
          </div>
        )}
      </button>
    </div>
  )
} 