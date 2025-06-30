'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function Footer() {
  const pathname = usePathname()
  const { t, locale: currentLocale } = useTranslations()
  return (
    <footer className="bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800/60 py-12 shadow-inner mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌信息 */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
              {t.brand.name}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t.brand.slogan}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span className="text-gray-300 text-sm">{t.brand.aiDriven}</span>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedPath('/features', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.features}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/pricing', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.pricing}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/faq', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持与帮助 */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.support}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedPath('/help', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.helpCenter}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/contact', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/usage-terms', currentLocale)} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
} 