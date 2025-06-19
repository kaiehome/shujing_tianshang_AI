'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { useState } from 'react'
import { getCurrentLocale, getLocalizedPath, isCurrentPath } from '../lib/i18n'
import LanguageDropdown from './LanguageDropdown'
import { useTranslations } from '../hooks/useTranslations'

export default function Navbar() {
  const pathname = usePathname()
  const { t, locale: currentLocale } = useTranslations()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 临时状态，实际应从auth context获取
  const [userPoints, setUserPoints] = useState(128) // 临时状态
  const [isVip, setIsVip] = useState(false) // 临时状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900/90 backdrop-blur-md border-b border-zinc-800 shadow-xl sticky top-0 z-50">
      {/* 左侧品牌区 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Artbud Logo" 
            className="h-10 w-10 rounded-full shadow-md bg-white object-cover ring-2 ring-orange-500/50" 
          />
          <Link 
            href={getLocalizedPath('/', currentLocale)} 
            className="text-xl md:text-2xl font-extrabold font-serif bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-widest transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_2px_12px_rgba(255,192,203,0.4)] hover:brightness-125"
          >
            ARTBUD
          </Link>
          </div>
        
        {/* 桌面端导航链接 */}
        <div className="hidden md:flex items-center gap-2">
          <Link 
            href={getLocalizedPath('/features', currentLocale)} 
            className={`group relative flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-all duration-300 transform hover:scale-105 ${
              isCurrentPath(pathname, '/features') 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-400/40 shadow-lg shadow-blue-500/20' 
                : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-400/30 border border-transparent'
            }`}
          >
            <svg className={`w-4 h-4 transition-all duration-300 ${pathname === '/features' ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'} group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-medium">{t.nav.features}</span>
            {isCurrentPath(pathname, '/features') && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl animate-pulse"></div>
            )}
          </Link>
          
          <Link 
            href={getLocalizedPath('/pricing', currentLocale)} 
            className={`group relative flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-all duration-300 transform hover:scale-105 ${
              isCurrentPath(pathname, '/pricing') 
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-400/40 shadow-lg shadow-orange-500/20' 
                : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:border-orange-400/30 border border-transparent'
            }`}
          >
            <svg className={`w-4 h-4 transition-all duration-300 ${pathname === '/pricing' ? 'text-orange-400' : 'text-gray-400 group-hover:text-orange-400'} group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="font-medium">{t.nav.pricing}</span>
            {isCurrentPath(pathname, '/pricing') && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-xl animate-pulse"></div>
            )}
          </Link>

             <Link 
            href={getLocalizedPath('/faq', currentLocale)} 
            className={`group relative flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-all duration-300 transform hover:scale-105 ${
              isCurrentPath(pathname, '/faq') 
                ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400 border border-green-400/40 shadow-lg shadow-green-500/20' 
                : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/10 hover:to-teal-500/10 hover:border-green-400/30 border border-transparent'
            }`}
          >
            <svg className={`w-4 h-4 transition-all duration-300 ${pathname === '/faq' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'} group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{t.nav.faq}</span>
            {isCurrentPath(pathname, '/faq') && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-xl animate-pulse"></div>
            )}
          </Link>
        </div>
      </div>

      {/* 右侧用户区 */}
      <div className="flex items-center gap-3">
        {/* 语言选择下拉框 */}
        <LanguageDropdown />
        {isLoggedIn ? (
          <>
            {/* 点数显示 */}
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-300 font-bold text-sm">{userPoints}</span>
              <span className="text-yellow-400/70 text-xs">{t.nav.points}</span>
            </div>

            {/* VIP标识 */}
            {isVip && (
              <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-3 py-1">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.455-1.746-.714-2.516zm6.86 4.026a.75.75 0 00-.973.757 29.19 29.19 0 01-.015.549c-.76.645-1.508 1.208-2.123 1.653a.75.75 0 000 1.114c.615.445 1.363 1.008 2.123 1.653.014.184.015.364.015.549a.75.75 0 00.973.757 41.32 41.32 0 002.53-.957c2.96-1.225 5.49-2.932 7.727-5.395a.75.75 0 000-1.114A29.72 29.72 0 0012.86 15.485z" clipRule="evenodd" />
                </svg>
                <span className="text-purple-300 font-bold text-xs">VIP</span>
              </div>
            )}

            {/* 我的作品按钮 */}
            <Link 
              href={getLocalizedPath('/history', currentLocale)} 
              className="flex items-center gap-2 text-white border-2 border-blue-400 rounded-lg px-4 py-2 hover:bg-blue-400/10 hover:text-blue-400 transition-all duration-200 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">{t.nav.myWorks}</span>
            </Link>

            {/* 用户头像和菜单 */}
            <div className="relative">
              <button className="flex items-center gap-2 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-500 hover:to-zinc-600 rounded-lg px-3 py-2 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <span className="hidden md:inline text-white text-sm">用户名</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 未登录状态 - 优化后的登录按钮组 */}
            <div className="flex items-center gap-2">
              {/* 登录按钮 */}
              <Link 
                href={getLocalizedPath('/login', currentLocale)} 
                className="group relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 rounded-lg border border-transparent hover:border-gray-600/50 hover:bg-gray-800/50"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t.nav.login}
                </span>
              </Link>

              {/* 注册按钮 */}
              <Link 
                href={getLocalizedPath('/login', currentLocale)} 
                className="group relative overflow-hidden px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {/* 渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-500"></div>
                
                {/* 光晕效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                
                {/* 按钮内容 */}
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t.nav.register}
                </span>
                
                {/* 闪光效果 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>
            </div>

            {/* 移动端专用登录按钮 */}
            <div className="flex md:hidden">
              <Link 
                href={getLocalizedPath('/login', currentLocale)} 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold transition-all duration-200 text-sm"
             >
               {t.nav.login}
             </Link>
            </div>
          </>
        )}

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-white p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-zinc-800 border-t border-zinc-700 md:hidden animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href={getLocalizedPath('/features', currentLocale)} 
              className="flex items-center gap-3 text-gray-200 hover:text-blue-400 hover:bg-blue-500/10 py-3 px-3 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">{t.nav.features}</span>
            </Link>
            
            <Link 
              href={getLocalizedPath('/pricing', currentLocale)} 
              className="flex items-center gap-3 text-gray-200 hover:text-orange-400 hover:bg-orange-500/10 py-3 px-3 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-400/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-medium">{t.nav.pricing}</span>
            </Link>
            
            <Link 
              href={getLocalizedPath('/faq', currentLocale)} 
              className="flex items-center gap-3 text-gray-200 hover:text-green-400 hover:bg-green-500/10 py-3 px-3 rounded-lg transition-all duration-200 border border-transparent hover:border-green-400/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t.nav.faq}</span>
            </Link>
            
            {/* 移动端登录/注册按钮 */}
            {!isLoggedIn && (
              <div className="pt-2 border-t border-zinc-700 space-y-2">
                <Link 
                  href={getLocalizedPath('/login', currentLocale)} 
                  className="block w-full text-center py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  {t.nav.login}
                </Link>
                <Link 
                  href={getLocalizedPath('/login', currentLocale)} 
                  className="block w-full text-center py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
            
            {isLoggedIn && (
              <div className="pt-2 border-t border-zinc-700">
                <div className="flex items-center gap-2 py-2">
                  <span className="text-yellow-400">💰</span>
                  <span className="text-white">{userPoints} {t.nav.points}</span>
                  {isVip && <span className="text-purple-400 text-sm">VIP</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
