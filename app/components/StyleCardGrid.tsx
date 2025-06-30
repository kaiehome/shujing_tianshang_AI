"use client"
import React, { useState, useEffect } from 'react'
import { stylePresets } from '../data/stylePresets'
import { useTranslations } from '../hooks/useTranslations'

interface StyleCardGridProps {
  styles: Array<{
    name_zh: string;
    name_en: string;
    description_zh: string;
    description_en: string;
    prompt_zh: string;
    prompt_en: string;
  }>;
  selectedIndex: number | null;
  onSelect: (prompt: string, idx: number) => void;
}

// 预览图映射函数 - 将风格名称映射到实际的文件名
const getPreviewImagePath = (styleName: string): string => {
  // 使用英文文件名，避免中文路径问题
  const imageMap: Record<string, string> = {
    '极简ins风': '/presets/minimal-ins.jpg',
    '治愈系插画': '/presets/healing.jpg',
    '生活方式摄影感插画': '/presets/lifestyle.jpg',
    '冥想风插画': '/presets/meditation.jpg',
    '水彩抽象情绪': '/presets/watercolor.jpg',
    '心灵卡片风': '/presets/spiritual.jpg',
    '品牌插画风': '/presets/brand.jpg',
    'Logo草图风': '/presets/logo-sketch.jpg',
    '概念视觉板': '/presets/moodboard.jpg',
    '板书感插画': '/presets/blackboard.jpg',
    '知识图谱风': '/presets/knowledge.jpg',
    '可爱教学插图': '/presets/cute-edu.jpg',
    '手绘贴纸风': '/presets/stickers.jpg',
    '日式可爱插画': '/presets/japanese-cute.jpg',
    '故事性插图': '/presets/story.jpg',
    '促销图风格': '/presets/promo.jpg',
    '节日热点模板': '/presets/holiday.jpg',
    '商品展示图': '/presets/product.jpg'
  }
  
  return imageMap[styleName] || '/presets/placeholder.jpg'
}

const StyleCardGrid: React.FC<StyleCardGridProps> = ({ styles, selectedIndex, onSelect }) => {
  const { t, locale } = useTranslations()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // 图片加载成功处理
  const handleImageLoad = (styleName: string) => {
    setLoadedImages(prev => new Set([...prev, styleName]))
  }

  // 图片加载失败处理
  const handleImageError = (styleName: string) => {
    setFailedImages(prev => new Set([...prev, styleName]))
  }

  // 重置加载状态当分类改变时，并预加载图片
  useEffect(() => {
    setLoadedImages(new Set())
    setFailedImages(new Set())
    
    // 预加载当前分类的所有图片
    styles.forEach((style) => {
      const img = new Image()
      img.src = getPreviewImagePath(style.name_zh)
      img.onload = () => handleImageLoad(style.name_zh)
      img.onerror = () => {
        // 尝试加载占位图
        const fallbackImg = new Image()
        fallbackImg.src = '/presets/placeholder.jpg'
        fallbackImg.onload = () => handleImageLoad(style.name_zh)
        fallbackImg.onerror = () => handleImageError(style.name_zh)
      }
    })
  }, [styles])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {styles.map((style, idx) => {
          const isLoaded = loadedImages.has(style.name_zh)
          const isFailed = failedImages.has(style.name_zh)
          const shouldShowLoading = !isLoaded && !isFailed
          
          return (
            <div
              key={idx}
              className={`group relative bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 transform hover:scale-102 overflow-hidden ${
                selectedIndex === idx
                  ? 'border-blue-400 ring-4 ring-blue-400/30 shadow-xl shadow-blue-500/25 scale-102'
                  : 'border-zinc-600/50 hover:border-blue-400/70 hover:shadow-lg'
              }`}
            >
              {/* 预览图片区域 */}
              <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-zinc-800">
                <img 
                  src={getPreviewImagePath(style.name_zh)}
                  alt={`${style.name_zh} 预览`}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    objectFit: 'cover',
                    backgroundColor: '#18181b' // zinc-900 fallback
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (target.src.indexOf('placeholder.jpg') === -1) {
                      target.src = '/presets/placeholder.jpg'
                    } else {
                      handleImageError(style.name_zh)
                    }
                  }}
                  onLoad={() => {
                    handleImageLoad(style.name_zh)
                  }}
                />
                
                {/* 加载状态 */}
                {shouldShowLoading && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-400">加载中...</span>
                    </div>
                  </div>
                )}
                
                {/* 加载失败状态 */}
                {isFailed && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">{t.styles.noPreview}</span>
                    </div>
                  </div>
                )}
                
                {/* 悬浮遮罩 - 只显示视觉效果，不显示按钮 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                
                {/* 选中标识 */}
                {selectedIndex === idx && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-20">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className={`font-bold text-lg mb-2 transition-colors ${
                    selectedIndex === idx ? 'text-blue-400' : 'text-white group-hover:text-blue-300'
                  }`}>
                    {locale === 'zh' ? style.name_zh : style.name_en}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed h-10 overflow-hidden line-clamp-2">
                    {locale === 'zh' ? style.description_zh : style.description_en}
                  </p>
                </div>
                
                {/* 标签和特性 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                    {t.styles.professional}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                    {t.styles.chineseFriendly}
                  </span>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelect(style.prompt_zh, idx)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      selectedIndex === idx
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                                      >
                      {selectedIndex === idx ? t.styles.selected : t.styles.useThisStyle}
                    </button>
                  
                  <button className="px-3 py-2 bg-zinc-600 hover:bg-zinc-500 text-gray-300 hover:text-white rounded-lg transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StyleCardGrid 