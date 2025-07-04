"use client"
import { useState } from 'react'
import { stylePresets } from '../data/stylePresets'
import { useTranslations } from '../hooks/useTranslations'

// 为每个角色添加图标
const categoryIcons: Record<string, string> = {
  "小红书|微博|抖音创作者": "📱",
  "情绪疗愈|身心灵用户": "🧘",
  "自由职业设计师|小众创意工作者": "🎨",
  "教培类|课程内容创作者": "👩‍🏫",
  "手帐|插画爱好者": "✏️",
  "微商|电商运营者": "🛒",
  "非遗--蜀锦蜀绣制作者": "🧵"
}

export default function StyleCategoryTabs({ 
  categories,
  selectedCategory,
  onSelectCategory
}: {
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  const { t, locale } = useTranslations()
  const isShuJin = (cat: string) => cat === '非遗--蜀锦蜀绣制作者'
  // 判断是否为最后一个且总数为奇数
  const isLastOdd = (cat: string, idx: number) => isShuJin(cat) && categories.length % 2 === 1 && idx === categories.length - 1
  return (
    <div className="w-full">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(locale === 'zh' ? cat.category_zh : cat.category_en)}
            className={`group relative px-6 py-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-102 ${
              selectedCategory === (locale === 'zh' ? cat.category_zh : cat.category_en)
                ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400 text-white shadow-xl shadow-orange-500/25 scale-102' 
                : 'bg-zinc-700/50 border-zinc-600 text-gray-200 hover:border-orange-400 hover:bg-zinc-600/70 hover:text-white'
            } ${isLastOdd(cat.category_zh || cat.category_en, idx) ? 'lg:col-span-3 mx-auto w-full' : isShuJin(cat.category_zh || cat.category_en) ? 'col-span-2 lg:col-span-2 justify-self-center w-full' : ''}`}
            style={isLastOdd(cat.category_zh || cat.category_en, idx) ? { minWidth: '420px', maxWidth: '700px' } : isShuJin(cat.category_zh || cat.category_en) ? { minWidth: '420px', maxWidth: '600px' } : {}}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`text-3xl transition-transform duration-300 ${
                selectedCategory === (locale === 'zh' ? cat.category_zh : cat.category_en) ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {cat.icon || '🎯'}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base leading-tight">
                  {locale === 'zh' ? cat.category_zh : cat.category_en}
                </h3>
                <div className={`text-xs opacity-75 ${
                  selectedCategory === (locale === 'zh' ? cat.category_zh : cat.category_en) ? 'text-orange-100' : 'text-gray-400'
                }`}>
                  {t.styles.stylesCount.replace('{count}', String(cat.styles.length))}
                </div>
              </div>
            </div>
            
            {/* 选中指示器 */}
            {selectedCategory === (locale === 'zh' ? cat.category_zh : cat.category_en) && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// 获取角色描述
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "小红书|微博|抖音创作者": "专为社交媒体内容创作打造，包含极简ins风、治愈系插画、生活方式插画等适合分享的风格。",
    "情绪疗愈|身心灵用户": "专注于情绪表达和心灵疗愈，提供冥想插画、水彩情绪图、心灵卡片风等温暖治愈的风格。",
    "自由职业设计师|小众创意工作者": "面向专业设计需求，涵盖品牌插画风、Logo草图风、概念视觉Moodboard等商业级风格。",
    "教培类|课程内容创作者": "专为教育场景设计，包含板书感插画、知识图谱风、可爱教学插图等教学友好的风格。",
    "手帐|插画爱好者": "满足个人创作喜好，提供手绘贴纸风、日式可爱插画、故事性插图等趣味性风格。",
    "微商|电商运营者": "针对营销推广需求，涵盖促销图风格、节日热点模板、商品展示图等商业应用风格。",
    "非遗--蜀锦蜀绣制作者": "中国非物质文化遗产传承人，专注于蜀锦蜀绣艺术风格的创作，融合传统织锦与刺绣工艺，展现东方美学与匠心精神。"
  }
  return descriptions[category] || "选择此角色开始您的AI绘画之旅"
} 