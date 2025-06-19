"use client"
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

// 定义图像数据接口
export interface ImageData {
  id: string
  url: string
  timestamp: number
  prompt?: string
  style?: string
  batchId?: string // 保留批次ID用于排序，但不显示标签
}

interface ImageResultGalleryProps {
  images?: (string | ImageData)[] // 兼容旧的字符串数组和新的ImageData数组
  isGenerating?: boolean
  isGuest?: boolean
  onDownloadAttempt?: () => void
  onSaveAttempt?: () => void
  onEditAttempt?: () => void
}

export default function ImageResultGallery({ 
  images = [], 
  isGenerating = false, 
  isGuest = false,
  onDownloadAttempt,
  onSaveAttempt,
  onEditAttempt
}: ImageResultGalleryProps) {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  
  // 生成中的占位符
  const placeholderItems = isGenerating ? [1, 2, 3, 4] : []

  // 处理图像数据，确保都是ImageData格式，并按时间排序（最新的在前）
  const processedImages = useMemo(() => {
    const imageDataArray: ImageData[] = images.map((item, index) => {
      if (typeof item === 'string') {
        // 兼容旧的字符串格式
        return {
          id: `legacy-${index}-${Date.now()}`,
          url: item,
          timestamp: Date.now() - (images.length - index) * 1000, // 模拟时间差
        }
      } else {
        // 新的ImageData格式
        return item
      }
    })
    
    // 按时间戳降序排序（最新的在前）
    return imageDataArray.sort((a, b) => b.timestamp - a.timestamp)
  }, [images])

  const handleDownload = (imageData: ImageData, index: number) => {
    if (isGuest) {
      onDownloadAttempt?.()
      return
    }
    
    // 注册用户的下载逻辑
    const link = document.createElement('a')
    link.href = imageData.url
    link.download = `ai-generated-${imageData.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleSave = () => {
    if (isGuest) {
      onSaveAttempt?.()
      return
    }
    
    // 注册用户的收藏逻辑
    alert('已添加到收藏！')
  }
  
  const handleEdit = () => {
    if (isGuest) {
      onEditAttempt?.()
      return
    }
    
    // 注册用户的编辑逻辑
    alert('编辑功能即将开放！')
  }
  
  return (
    <div className="w-full">
      {/* 当没有任何图片且正在生成时显示居中的加载状态 */}
      {isGenerating && processedImages.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">AI正在为您生成图像...</p>
            <p className="text-sm text-gray-400 mt-2">预计需要10-30秒</p>
          </div>
        </div>
      )}
      
      {/* 访客提示横幅 */}
      {isGuest && (processedImages.length > 0 || isGenerating) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div className="flex-1">
              <p className="text-orange-400 font-semibold mb-1">想保存你的灵感？</p>
              <p className="text-gray-300 text-sm">注册免费获取30点数，解锁高清下载和作品管理功能！</p>
            </div>
            <button 
              onClick={() => window.location.href = getLocalizedPath('/login', currentLocale)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:scale-105 transition-transform"
            >
              立即注册
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* 生成中的占位符 - 显示在最前面 */}
        {isGenerating && processedImages.length > 0 && placeholderItems.map(i => (
          <div key={`placeholder-${i}`} className="bg-zinc-700/30 rounded-xl border border-zinc-600/20 animate-pulse">
            <div className="h-48 bg-zinc-600/50 rounded-t-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-gray-400 text-sm">生成中...</span>
              </div>
            </div>
            <div className="p-4">
              <div className="h-8 bg-zinc-600/30 rounded animate-pulse"></div>
            </div>
          </div>
        ))}

        {/* 显示已生成的图片 - 按时间排序，最新的在前 */}
        {processedImages.map((imageData, index) => (
          <div key={imageData.id} className="bg-zinc-700/50 rounded-xl overflow-hidden border border-zinc-600/30 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="relative">
              <img 
                src={imageData.url} 
                alt={`生成的图片 ${imageData.id}`}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* 访客水印 */}
              {isGuest && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                    预览模式 · 注册解锁高清
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <button 
                  onClick={() => setEnlargedImage(imageData.url)}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  查看大图
                </button>
              </div>
            </div>
            <div className="p-4">
              {/* 提示词预览 */}
              {imageData.prompt && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 line-clamp-2" title={imageData.prompt}>
                    {imageData.prompt}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center gap-2">
                <button 
                  onClick={() => handleDownload(imageData, index)}
                  className={`flex-1 text-xs text-white px-3 py-2 rounded-lg transition-colors font-medium ${
                    isGuest 
                      ? 'bg-gray-500 hover:bg-gray-400 cursor-pointer' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  title={isGuest ? '注册后可下载高清图片' : '下载图片'}
                >
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isGuest ? '🔒下载' : '下载'}
                </button>
                <button 
                  onClick={handleSave}
                  className={`flex-1 text-xs text-white px-3 py-2 rounded-lg transition-colors font-medium mx-1 ${
                    isGuest 
                      ? 'bg-gray-500 hover:bg-gray-400 cursor-pointer' 
                      : 'bg-pink-500 hover:bg-pink-600'
                  }`}
                  title={isGuest ? '注册后可收藏作品' : '收藏作品'}
                >
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isGuest ? '🔒收藏' : '收藏'}
                </button>
                <button 
                  onClick={handleEdit}
                  className={`flex-1 text-xs text-white px-3 py-2 rounded-lg transition-colors font-medium ${
                    isGuest 
                      ? 'bg-gray-500 hover:bg-gray-400 cursor-pointer' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  title={isGuest ? '注册后可编辑图片' : '编辑图片'}
                >
                  <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {isGuest ? '🔒编辑' : '编辑'}
                </button>
              </div>
              
              {/* 只保留访客模式标识 */}
              {isGuest && (
                <div className="mt-3 flex justify-end">
                  <span className="text-orange-400 bg-orange-500/10 px-2 py-1 rounded text-xs">
                    访客模式
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {processedImages.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-lg">还没有生成图片</p>
          <p className="text-gray-500 text-sm mt-2">选择风格并描述您想要的图像，点击"立即生成"开始创作</p>
        </div>
      )}

      {/* 大图预览模态框 */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEnlargedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img 
              src={enlargedImage} 
              alt="放大预览"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {isGuest && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-sm">🔒 注册后可下载高清无水印版本</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 