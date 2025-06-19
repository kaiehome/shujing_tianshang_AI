"use client"

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react'
import { useImageManager } from '../hooks/useImageManager'
import ImagePreviewPanel from './ImagePreviewPanel'
import { ImageData, ImageSortBy, ImageSortOrder } from '../lib/types'
import { 
  PhotoIcon, 
  HeartIcon, 
  FolderIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  TagIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface MyWorksPageProps {
  userId: string
  userName?: string
  onImageEdit?: (image: ImageData) => void
}

type ViewType = 'all' | 'favorites' | 'by-tags'

interface WorksStats {
  totalImages: number
  favoriteCount: number
  tagsCount: number
  recentCount: number
}

// 优化的统计卡片组件
const StatsCard = memo<{
  icon: React.ReactNode
  title: string
  value: number
  description: string
  color: string
  onClick?: () => void
  isLoading?: boolean
}>(({ icon, title, value, description, color, onClick, isLoading = false }) => (
  <div 
    className={`
      bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 transition-all duration-300 
      ${onClick ? 'cursor-pointer hover:border-zinc-600 hover:bg-zinc-800/70 hover:scale-105' : ''}
      ${isLoading ? 'animate-pulse' : ''}
    `}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} transition-transform duration-300 ${onClick ? 'group-hover:scale-110' : ''}`}>
        {icon}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">
          {isLoading ? (
            <div className="w-8 h-6 bg-zinc-600 rounded animate-pulse"></div>
          ) : (
            value.toLocaleString()
          )}
        </div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
    </div>
    <div className="text-xs text-gray-500">{description}</div>
  </div>
))

StatsCard.displayName = 'StatsCard'

// 优化的标签过滤面板
const TagFilterPanel = memo<{
  userTags: any[]
  selectedTagFilter: string | null
  onTagFilter: (tagName: string | null) => void
  isLoading?: boolean
}>(({ userTags, selectedTagFilter, onTagFilter, isLoading = false }) => (
  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
    <div className="flex items-center gap-2 mb-3">
      <TagIcon className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-300">按标签筛选</span>
    </div>
    
    {isLoading ? (
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-16 h-6 bg-zinc-700 rounded-full animate-pulse"></div>
        ))}
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagFilter(null)}
          className={`
            px-3 py-1 rounded-full text-xs transition-all duration-200
            ${selectedTagFilter === null
              ? 'bg-blue-500 text-white scale-105'
              : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:scale-105'
            }
          `}
        >
          全部
        </button>
        
        {userTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagFilter(tag.name)}
            className={`
              px-3 py-1 rounded-full text-xs transition-all duration-200
              ${selectedTagFilter === tag.name
                ? 'text-white scale-105'
                : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:scale-105'
              }
            `}
            style={{ 
              backgroundColor: selectedTagFilter === tag.name ? tag.color : undefined 
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    )}
  </div>
))

TagFilterPanel.displayName = 'TagFilterPanel'

// 优化的视图切换标签
const ViewTabs = memo<{
  currentView: ViewType
  totalCount: number
  favoriteCount: number
  onViewChange: (view: ViewType) => void
}>(({ currentView, totalCount, favoriteCount, onViewChange }) => (
  <div className="flex flex-wrap gap-2 border-b border-zinc-700 pb-4">
    <button
      onClick={() => onViewChange('all')}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${currentView === 'all' 
          ? 'bg-blue-500 text-white scale-105' 
          : 'text-gray-400 hover:text-white hover:bg-zinc-800 hover:scale-105'
        }
      `}
    >
      <FolderIcon className="w-4 h-4" />
      全部作品 ({totalCount})
    </button>
    
    <button
      onClick={() => onViewChange('favorites')}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${currentView === 'favorites' 
          ? 'bg-red-500 text-white scale-105' 
          : 'text-gray-400 hover:text-white hover:bg-zinc-800 hover:scale-105'
        }
      `}
    >
      <HeartIcon className="w-4 h-4" />
      收藏作品 ({favoriteCount})
    </button>
    
    <button
      onClick={() => onViewChange('by-tags')}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${currentView === 'by-tags' 
          ? 'bg-green-500 text-white scale-105' 
          : 'text-gray-400 hover:text-white hover:bg-zinc-800 hover:scale-105'
        }
      `}
    >
      <TagIcon className="w-4 h-4" />
      按标签浏览
    </button>
  </div>
))

ViewTabs.displayName = 'ViewTabs'

export default function MyWorksPage({ userId, userName, onImageEdit }: MyWorksPageProps) {
  // 状态管理
  const [currentView, setCurrentView] = useState<ViewType>('all')
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)

  // 使用图像管理 Hook
  const {
    images,
    loading,
    error,
    hasMore,
    totalCount,
    userTags,
    deleteImage,
    toggleFavorite,
    batchFavorite,
    batchUnfavorite,
    batchDelete,
    loadImages,
    loadMoreImages,
    refreshImages,
    loadFavorites,
    updateImageInList
  } = useImageManager({ 
    userId, 
    autoLoad: true,
    cacheKey: `myworks_${currentView}_${selectedTagFilter || 'all'}`
  })

  // 优化的统计数据计算
  const stats = useMemo<WorksStats>(() => {
    const now = Date.now()
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

    return {
      totalImages: totalCount,
      favoriteCount: images.filter(img => img.is_favorite).length,
      tagsCount: userTags.length,
      recentCount: images.filter(img => img.timestamp > oneWeekAgo).length
    }
  }, [images, totalCount, userTags])

  // 优化的过滤图像
  const filteredImages = useMemo(() => {
    if (!selectedTagFilter) return images
    return images.filter(img => img.tags?.includes(selectedTagFilter))
  }, [images, selectedTagFilter])

  // 优化的视图切换处理
  const handleViewChange = useCallback(async (view: ViewType) => {
    if (view === currentView) return // 避免重复切换

    setCurrentView(view)
    setSelectedTagFilter(null)

    switch (view) {
      case 'all':
        await loadImages()
        break
      case 'favorites':
        await loadFavorites()
        break
      case 'by-tags':
        // 保持当前图像，用户会选择特定标签
        break
    }
  }, [currentView, loadImages, loadFavorites])

  // 优化的标签过滤处理
  const handleTagFilter = useCallback(async (tagName: string | null) => {
    if (tagName === selectedTagFilter) return // 避免重复设置

    setSelectedTagFilter(tagName)
    
    if (currentView !== 'by-tags') {
      setCurrentView('by-tags')
    }
    
    // 如果清除标签过滤，重新加载所有图像
    if (!tagName) {
      await loadImages()
    }
  }, [selectedTagFilter, currentView, loadImages])

  // 优化的图像操作处理
  const handleImageOperation = useCallback(async (image: ImageData, operation: string) => {
    try {
      switch (operation) {
        case 'favorite':
        case 'unfavorite':
          const newFavoriteState = operation === 'favorite'
          const success = await toggleFavorite(image.id, newFavoriteState)
          if (success) {
            updateImageInList(image.id, { is_favorite: newFavoriteState })
          }
          break
        
        case 'delete':
          if (confirm('确认删除这张图像吗？此操作不可撤销。')) {
            await deleteImage(image.id)
          }
          break
        
        case 'edit':
          onImageEdit?.(image)
          break
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }, [toggleFavorite, deleteImage, updateImageInList, onImageEdit])

  // 优化的图像变更处理
  const handleImagesChange = useCallback((updatedImages: ImageData[]) => {
    // 这个回调由 ImagePreviewPanel 调用，大部分状态已通过 useImageManager 同步
    // 这里可以添加额外的同步逻辑，如果需要的话
  }, [])

  // 优化的刷新处理
  const handleRefresh = useCallback(async () => {
    try {
      await refreshImages()
    } catch (error) {
      console.error('刷新失败:', error)
    }
  }, [refreshImages])

  // 页面标题和描述
  const pageTitle = useMemo(() => {
    switch (currentView) {
      case 'favorites':
        return '我的收藏'
      case 'by-tags':
        return selectedTagFilter ? `标签: ${selectedTagFilter}` : '按标签浏览'
      default:
        return '我的作品'
    }
  }, [currentView, selectedTagFilter])

  const pageDescription = useMemo(() => {
    if (userName) {
      return `${userName} 的创作空间`
    }
    
    switch (currentView) {
      case 'favorites':
        return '您收藏的精选作品集合'
      case 'by-tags':
        return '按标签分类浏览您的作品'
      default:
        return '管理您的 AI 生成作品'
    }
  }, [currentView, userName])

  // 空状态处理
  const emptyStateConfig = useMemo(() => {
    switch (currentView) {
      case 'favorites':
        return {
          title: '还没有收藏任何作品',
          description: '去创作一些精美的作品并收藏它们吧！',
          showCreateButton: false
        }
      case 'by-tags':
        return selectedTagFilter ? {
          title: `没有标记为"${selectedTagFilter}"的作品`,
          description: '尝试创建一些作品并添加这个标签',
          showCreateButton: true
        } : {
          title: '选择一个标签来浏览作品',
          description: '使用上方的标签按钮来筛选您的作品',
          showCreateButton: false
        }
      default:
        return {
          title: '还没有创建任何作品',
          description: '开始您的 AI 创作之旅，生成您的第一个作品！',
          showCreateButton: true
        }
    }
  }, [currentView, selectedTagFilter])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 页面头部 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-gray-400">{pageDescription}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-zinc-600 hover:scale-105"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<PhotoIcon className="w-6 h-6 text-white" />}
          title="总作品数"
          value={stats.totalImages}
          description="您的所有 AI 生成作品"
          color="bg-blue-500/20"
          onClick={() => handleViewChange('all')}
          isLoading={loading && currentView === 'all'}
        />
        
        <StatsCard
          icon={<HeartSolidIcon className="w-6 h-6 text-white" />}
          title="收藏作品"
          value={stats.favoriteCount}
          description="您收藏的精选作品"
          color="bg-red-500/20"
          onClick={() => handleViewChange('favorites')}
          isLoading={loading && currentView === 'favorites'}
        />
        
        <StatsCard
          icon={<TagIcon className="w-6 h-6 text-white" />}
          title="标签数量"
          value={stats.tagsCount}
          description="用于分类的标签"
          color="bg-green-500/20"
          onClick={() => handleViewChange('by-tags')}
        />
        
        <StatsCard
          icon={<CalendarIcon className="w-6 h-6 text-white" />}
          title="本周新增"
          value={stats.recentCount}
          description="最近 7 天创建的作品"
          color="bg-purple-500/20"
        />
      </div>

      {/* 视图切换标签 */}
      <ViewTabs
        currentView={currentView}
        totalCount={totalCount}
        favoriteCount={stats.favoriteCount}
        onViewChange={handleViewChange}
      />

      {/* 标签过滤器 */}
      {currentView === 'by-tags' && (
        <TagFilterPanel
          userTags={userTags}
          selectedTagFilter={selectedTagFilter}
          onTagFilter={handleTagFilter}
          isLoading={loading}
        />
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">操作失败</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="ml-auto text-red-400 hover:text-red-300 text-sm underline transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="min-h-[400px]">
        {loading && filteredImages.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">正在加载您的作品...</p>
              <p className="text-gray-500 text-sm mt-2">首次加载可能需要几秒钟</p>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <PhotoIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {emptyStateConfig.title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {emptyStateConfig.description}
            </p>
            {emptyStateConfig.showCreateButton && (
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                开始创作
              </button>
            )}
          </div>
        ) : (
          <ImagePreviewPanel
            images={filteredImages}
            userId={userId}
            isGenerating={loading}
            onImageEdit={onImageEdit}
            onImagesChange={handleImagesChange}
            className="pb-8"
          />
        )}

        {/* 加载更多按钮 */}
        {hasMore && !loading && filteredImages.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadMoreImages}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-all duration-200 border border-zinc-600 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                加载更多作品
              </div>
            </button>
          </div>
        )}

        {/* 加载中的加载更多状态 */}
        {loading && filteredImages.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              正在加载更多...
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 