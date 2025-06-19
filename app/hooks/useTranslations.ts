'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getCurrentLocale, type Locale } from '../lib/i18n'
import { getTranslations } from '../lib/translations'

export function useTranslations() {
  const pathname = usePathname()
  
  // 直接从路径检测语言，避免复杂的参数处理
  const getLocaleFromPath = (path: string): Locale => {
    if (path.startsWith('/zh')) {
      return 'zh'
    }
    return 'en'
  }
  
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      // 客户端：从当前 URL 检测
      const locale = getLocaleFromPath(window.location.pathname)
      console.log('useTranslations initial locale (client):', locale, 'from path:', window.location.pathname)
      return locale
    }
    // 服务端：从 pathname 检测
    const locale = getLocaleFromPath(pathname)
    console.log('useTranslations initial locale (server):', locale, 'from path:', pathname)
    return locale
  })
  
  // 监听路径变化
  useEffect(() => {
    const newLocale = getLocaleFromPath(pathname)
    console.log('useTranslations path changed:', pathname, 'new locale:', newLocale, 'current locale:', currentLocale)
    if (newLocale !== currentLocale) {
      console.log('useTranslations updating locale from', currentLocale, 'to', newLocale)
      setCurrentLocale(newLocale)
    }
  }, [pathname, currentLocale])
  
  const t = getTranslations(currentLocale)
  
  return {
    t,
    locale: currentLocale,
    isZh: currentLocale === 'zh',
    isEn: currentLocale === 'en'
  }
} 