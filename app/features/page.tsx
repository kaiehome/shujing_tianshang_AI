'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function FeaturesPage() {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const { t, locale } = useTranslations()

  const features = [
    {
      icon: "🖼",
      color: "from-blue-500 to-cyan-500",
      title: t.features.feature1Title,
      description: t.features.feature1Desc
    },
    {
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
      title: t.features.feature2Title,
      description: t.features.feature2Desc
    },
    {
      icon: "✍️",
      color: "from-green-500 to-teal-500",
      title: t.features.feature3Title,
      description: t.features.feature3Desc
    },
    {
      icon: "🔧",
      color: "from-orange-500 to-red-500",
      title: t.features.feature4Title,
      description: t.features.feature4Desc
    },
    {
      icon: "📥",
      color: "from-indigo-500 to-purple-500",
      title: t.features.feature5Title,
      description: t.features.feature5Desc
    },
    {
      icon: "💾",
      color: "from-pink-500 to-rose-500",
      title: t.features.feature6Title,
      description: t.features.feature6Desc
    },
    {
      icon: "💬",
      color: "from-yellow-500 to-orange-500",
      title: t.features.feature7Title,
      description: t.features.feature7Desc
    },
    {
      icon: "💎",
      color: "from-cyan-500 to-blue-500",
      title: t.features.feature8Title,
      description: t.features.feature8Desc
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-6xl mx-auto w-full py-8 px-4">
        {/* Hero Section - 标题区 */}
        <section className="flex flex-col items-center justify-center text-center mb-12" id="features-hero">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t.features.title}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-4 whitespace-nowrap">
            {t.features.slogan}
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {features.length} {t.features.countSuffix}
          </div>
        </section>

        {/* Features Content - 功能特性区 */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-600/50 hover:border-blue-400/70 transition-all duration-300 transform hover:scale-102 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlight Section - 核心优势 */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border border-orange-500/30 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
                              <h3 className="text-2xl font-bold text-orange-300">{t.features.whyTitle}</h3>
            </div>
            <p className="text-gray-200 mb-6 text-lg max-w-4xl mx-auto">
              {t.features.whyDesc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400 mb-2">21+</div>
                <div className="text-blue-300 text-sm">{t.features.why21}</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400 mb-2">10</div>
                <div className="text-green-300 text-sm">{t.features.why10}</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400 mb-2">7</div>
                <div className="text-purple-300 text-sm">{t.features.why7}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - 行动召唤 */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 backdrop-blur-sm rounded-xl py-8 px-6 border border-zinc-600/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{t.features.ctaTitle}</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t.features.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={getLocalizedPath('/', currentLocale)} 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t.features.ctaStart}
              </Link>
              <Link 
                href={getLocalizedPath('/pricing', currentLocale)} 
                className="flex items-center gap-2 bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {t.features.ctaPricing}
              </Link>
            </div>
          </div>
        </section>

        {/* 返回首页按钮 */}
        <section className="text-center">
          <Link
            href={getLocalizedPath('/', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.features.backHome}
          </Link>
        </section>
      </div>
    </div>
  );
}