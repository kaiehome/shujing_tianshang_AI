'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { switchLanguage } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function LanguageDropdown() {
  const router = useRouter()
  const { t, locale: currentLocale } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 语言选项
  const languages = [
    { code: 'zh', name: t.language.chinese, flag: '🇨🇳' },
    { code: 'en', name: t.language.english, flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[1]

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    console.log('Language change requested:', languageCode, 'Current:', currentLocale)
    
    if (languageCode !== currentLocale) {
      const targetLocale = languageCode as 'zh' | 'en'
      const currentPath = window.location.pathname
      const newPath = switchLanguage(currentPath, targetLocale)
      
      console.log('Switching from', currentPath, 'to', newPath)
      
      // 使用 replace 而不是 push，避免历史记录问题
      router.replace(newPath)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 下拉框触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg border border-zinc-600/30 hover:border-zinc-500/50 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="font-medium">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-zinc-800 border border-zinc-600/50 rounded-lg shadow-xl z-50 overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 hover:bg-zinc-700/50 ${
                currentLocale === language.code 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {currentLocale === language.code && (
                <svg className="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 