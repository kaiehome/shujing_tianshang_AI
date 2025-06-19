"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { ImageData, ImageTag, ImageOperation, ImagePreviewMode, ImageSortBy, ImageSortOrder } from '../lib/types'
import { ImageService } from '../lib/imageService'
import { 
  HeartIcon, 
  ArrowDownTrayIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon,
  TagIcon,
  EyeIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface ImagePreviewPanelProps {
  images: ImageData[]
  userId?: string
  isGuest?: boolean
  isGenerating?: boolean
  onImageSelect?: (image: ImageData) => void
  onImageEdit?: (image: ImageData) => void
  onImagesChange?: (images: ImageData[]) => void
  className?: string
}

// 优化的懒加载图像组件
const LazyImage = memo<{
  src: string
  alt: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}>(({ src, alt, className, onLoad, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!imgRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    observerRef.current.observe(imgRef.current)

    return () => observerRef.current?.disconnect()
  }, [])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsError(true)
    onError?.()
  }, [onError])

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <>
          {!isLoaded && !isError && (
            <div className="w-full h-48 bg-zinc-700/50 animate-pulse rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={src} 
            alt={alt}
            className={`${className} transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
          
          {isError && (
            <div className="w-full h-48 bg-zinc-700/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">加载失败</span>
            </div>
          )}
        </>
      )}
    </div>
  )
})

LazyImage.displayName = 'LazyImage'

// 优化的图像卡片组件
const ImageCard = memo<{
  image: ImageData
  isSelected: boolean
  isSelectionMode: boolean
  onSelect: (selected: boolean) => void
  onOperation: (operation: ImageOperation) => void
  onTagsUpdate: (tags: string[]) => void
  userTags: ImageTag[]
  isGuest: boolean
}>(({ 
  image, 
  isSelected, 
  isSelectionMode, 
  onSelect, 
  onOperation, 
  onTagsUpdate, 
  userTags, 
  isGuest 
}) => {
  const [showLightbox, setShowLightbox] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleDownload = useCallback(async () => {
    if (isGuest) {
      alert('请登录后下载图像')
      return
    }

    try {
      setIsLoading(true)
      // 创建一个临时链接进行下载
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-generated-${image.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }, [image, isGuest])

  const handleFavorite = useCallback(async () => {
    if (isGuest) {
      alert('请登录后收藏图像')
      return
    }

    setIsLoading(true)
    try {
      onOperation(image.is_favorite ? 'unfavorite' : 'favorite')
    } finally {
      setIsLoading(false)
    }
  }, [image.is_favorite, isGuest, onOperation])

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI 生成的图像',
          text: image.prompt || '查看这张精美的 AI 生成图像',
          url: image.url
        })
      } else {
        await navigator.clipboard.writeText(image.url)
        alert('图像链接已复制到剪贴板')
      }
    } catch (error) {
      console.error('分享失败:', error)
      try {
        await navigator.clipboard.writeText(image.url)
        alert('图像链接已复制到剪贴板')
      } catch (clipboardError) {
        console.error('复制失败:', clipboardError)
        alert('分享失败，请重试')
      }
    }
  }, [image])

  // 快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showLightbox) return
      
      if (e.key === 'Escape') {
        setShowLightbox(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [showLightbox])

  return (
    <>
      <div className={`
        relative group bg-zinc-800/50 rounded-xl overflow-hidden border transition-all duration-300
        ${isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-zinc-700/50 hover:border-zinc-600'}
        ${isSelectionMode ? 'cursor-pointer' : ''}
        ${!imageLoaded ? 'min-h-[300px]' : ''}
      `}>
        {/* 选择模式覆盖层 */}
        {isSelectionMode && (
          <div 
            className="absolute inset-0 z-20 bg-black/30 flex items-center justify-center cursor-pointer"
            onClick={() => onSelect(!isSelected)}
          >
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${isSelected ? 'bg-blue-500 border-blue-500 scale-110' : 'bg-white/20 border-white/50 hover:scale-110'}
            `}>
              {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
            </div>
          </div>
        )}

        {/* 图像 */}
        <div className="relative">
          <LazyImage
            src={image.url} 
            alt={image.prompt || 'Generated image'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* 访客水印 */}
          {isGuest && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                预览模式
              </div>
            </div>
          )}

          {/* 悬停操作栏 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowLightbox(true)}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110"
                title="查看大图"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              {!isGuest && (
                <>
                  <button
                    onClick={handleFavorite}
                    disabled={isLoading}
                    className={`
                      backdrop-blur-sm text-white p-2 rounded-lg transition-all duration-200 hover:scale-110
                      ${image.is_favorite 
                        ? 'bg-red-500/80 hover:bg-red-600/80' 
                        : 'bg-white/20 hover:bg-white/30'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    title={image.is_favorite ? '取消收藏' : '收藏'}
                  >
                    {image.is_favorite ? (
                      <HeartSolidIcon className="w-4 h-4" />
                    ) : (
                      <HeartIcon className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setShowTagDialog(true)}
                    className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-110"
                    title="添加标签"
                  >
                    <TagIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 图像信息 */}
        <div className="p-4">
          {/* 提示词 */}
          {image.prompt && (
            <p className="text-sm text-gray-300 line-clamp-2 mb-3" title={image.prompt}>
              {image.prompt}
            </p>
          )}

          {/* 标签 */}
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {image.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                  +{image.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`
                flex-1 text-xs px-3 py-2 rounded-lg transition-all duration-200 font-medium
                ${isGuest || isLoading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105'
                }
              `}
              title={isGuest ? '请登录后下载' : '下载图像'}
            >
              <ArrowDownTrayIcon className="w-3 h-3 inline mr-1" />
              {isLoading ? '下载中...' : isGuest ? '🔒下载' : '下载'}
            </button>

            <button
              onClick={() => onOperation('edit')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105"
              title="再次编辑"
            >
              <PencilIcon className="w-3 h-3 inline mr-1" />
              编辑
            </button>

            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              title="分享"
            >
              <ShareIcon className="w-3 h-3" />
            </button>

            {!isGuest && (
              <button
                onClick={() => onOperation('delete')}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                title="删除"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 优化的大图预览 */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <img 
              src={image.url} 
              alt={image.prompt || 'Generated image'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              loading="eager"
            />
            
            {/* 图像信息叠加 */}
            {image.prompt && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-sm">{image.prompt}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 标签编辑对话框 */}
      {showTagDialog && (
        <TagEditDialog
          image={image}
          userTags={userTags}
          onClose={() => setShowTagDialog(false)}
          onUpdate={onTagsUpdate}
        />
      )}
    </>
  )
})

ImageCard.displayName = 'ImageCard'

// 优化的标签编辑对话框
const TagEditDialog = memo<{
  image: ImageData
  userTags: ImageTag[]
  onClose: () => void
  onUpdate: (tags: string[]) => void
}>(({ image, userTags, onClose, onUpdate }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(image.tags || [])
  const [newTag, setNewTag] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [filteredTags, setFilteredTags] = useState<ImageTag[]>(userTags)

  // 搜索过滤标签
  useEffect(() => {
    if (newTag.trim()) {
      const filtered = userTags.filter(tag => 
        tag.name.toLowerCase().includes(newTag.toLowerCase())
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags(userTags)
    }
  }, [newTag, userTags])

  const handleCreateTag = useCallback(async () => {
    if (!newTag.trim() || !image.user_id) return

    setIsCreating(true)
    try {
      const tag = await ImageService.createTag(image.user_id, newTag.trim())
      if (tag) {
        userTags.push(tag)
        setSelectedTags(prev => [...prev, tag.name])
        setNewTag('')
      }
    } finally {
      setIsCreating(false)
    }
  }, [newTag, image.user_id, userTags])

  const handleSave = useCallback(async () => {
    try {
      onUpdate(selectedTags)
      onClose()
    } catch (error) {
      console.error('更新标签失败:', error)
    }
  }, [selectedTags, onUpdate, onClose])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleCreateTag()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [newTag, handleCreateTag, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">编辑标签</h3>
        
        {/* 创建新标签 */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="搜索或创建新标签"
              className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg border border-zinc-600 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
            <button
              onClick={handleCreateTag}
              disabled={!newTag.trim() || isCreating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PlusIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 标签列表 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            选择标签 ({selectedTags.length} 已选):
          </h4>
          <div className="max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag.name) 
                        ? prev.filter(t => t !== tag.name)
                        : [...prev, tag.name]
                    )
                  }}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${selectedTags.includes(tag.name)
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:scale-105'
                    }
                  `}
                  style={{ 
                    backgroundColor: selectedTags.includes(tag.name) ? tag.color : undefined 
                  }}
                >
                  {tag.name}
                </button>
              ))}
              
              {filteredTags.length === 0 && newTag.trim() && (
                <div className="text-gray-400 text-sm py-2">
                  没有找到匹配的标签，按回车创建新标签
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
})

TagEditDialog.displayName = 'TagEditDialog'

// 主组件
export default function ImagePreviewPanel({
  images,
  userId,
  isGuest = false,
  isGenerating = false,
  onImageSelect,
  onImageEdit,
  onImagesChange,
  className = ''
}: ImagePreviewPanelProps) {
  // 状态管理
  const [viewMode, setViewMode] = useState<ImagePreviewMode>('grid')
  const [sortBy, setSortBy] = useState<ImageSortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<ImageSortOrder>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [userTags, setUserTags] = useState<ImageTag[]>([])
  const [batchLoading, setBatchLoading] = useState(false)

  // 防抖搜索
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // 加载用户标签
  useEffect(() => {
    if (userId && !isGuest) {
      ImageService.getUserTags(userId).then(setUserTags)
    }
  }, [userId, isGuest])

  // 优化的搜索和过滤
  const filteredImages = useMemo(() => {
    let result = [...images]

    // 搜索过滤
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      result = result.filter(image => 
        image.prompt?.toLowerCase().includes(query) ||
        image.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 排序
    result.sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'created_at':
          compareValue = a.timestamp - b.timestamp
          break
        case 'prompt':
          compareValue = (a.prompt || '').localeCompare(b.prompt || '')
          break
        case 'style':
          compareValue = (a.style || '').localeCompare(b.style || '')
          break
        case 'favorites':
          compareValue = (a.is_favorite ? 1 : 0) - (b.is_favorite ? 1 : 0)
          break
        default:
          compareValue = 0
      }

      return sortOrder === 'desc' ? -compareValue : compareValue
    })

    return result
  }, [images, debouncedSearchQuery, sortBy, sortOrder])

  // 处理图像操作
  const handleImageOperation = useCallback(async (image: ImageData, operation: ImageOperation) => {
    if (isGuest && ['favorite', 'delete', 'tag'].includes(operation)) {
      alert('请登录后使用此功能')
      return
    }

    if (!userId) return

    try {
      switch (operation) {
        case 'favorite':
          await ImageService.addToFavorites(userId, image.id)
          break
        case 'unfavorite':
          await ImageService.removeFromFavorites(userId, image.id)
          break
        case 'delete':
          if (confirm('确认删除这张图像吗？')) {
            await ImageService.deleteImage(userId, image.id)
          }
          break
        case 'edit':
          onImageEdit?.(image)
          break
      }

      // 刷新图像列表
      if (onImagesChange) {
        const updatedImages = images.map(img => 
          img.id === image.id 
            ? { ...img, is_favorite: operation === 'favorite' ? true : operation === 'unfavorite' ? false : img.is_favorite }
            : img
        ).filter(img => operation === 'delete' ? img.id !== image.id : true)
        
        onImagesChange(updatedImages)
      }
    } catch (error) {
      console.error('操作失败:', error)
      alert('操作失败，请重试')
    }
  }, [userId, isGuest, images, onImageEdit, onImagesChange])

  // 批量操作
  const handleBatchOperation = useCallback(async (operation: 'favorite' | 'unfavorite' | 'delete') => {
    if (!userId || selectedImages.size === 0) return

    setBatchLoading(true)
    try {
      const imageIds = Array.from(selectedImages)
      await ImageService.batchUpdateImages(userId, imageIds, operation)
      
      // 刷新图像列表
      if (onImagesChange) {
        let updatedImages = [...images]
        
        if (operation === 'delete') {
          updatedImages = updatedImages.filter(img => !selectedImages.has(img.id))
        } else {
          updatedImages = updatedImages.map(img => 
            selectedImages.has(img.id)
              ? { ...img, is_favorite: operation === 'favorite' }
              : img
          )
        }
        
        onImagesChange(updatedImages)
      }

      setSelectedImages(new Set())
      setIsSelectionMode(false)
    } catch (error) {
      console.error('批量操作失败:', error)
      alert('批量操作失败，请重试')
    } finally {
      setBatchLoading(false)
    }
  }, [userId, selectedImages, images, onImagesChange])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
      
      switch (e.key) {
        case 'g':
          setViewMode('grid')
          break
        case 'l':
          setViewMode('list')
          break
        case 'Escape':
          setIsSelectionMode(false)
          setSelectedImages(new Set())
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (isGenerating && filteredImages.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">AI正在为您生成图像...</p>
          <p className="text-sm text-gray-400 mt-2">预计需要10-30秒</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* 搜索框 */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索图像、标签..."
            className="w-full bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {/* 视图模式切换 */}
          <div className="flex bg-zinc-800 rounded-lg border border-zinc-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="网格视图 (G)"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="列表视图 (L)"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 排序选择 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [ImageSortBy, ImageSortOrder]
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="created_at-desc">最新创建</option>
            <option value="created_at-asc">最早创建</option>
            <option value="favorites-desc">收藏优先</option>
            <option value="prompt-asc">提示词 A-Z</option>
            <option value="prompt-desc">提示词 Z-A</option>
          </select>

          {/* 批量选择模式 */}
          {!isGuest && filteredImages.length > 0 && (
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode)
                setSelectedImages(new Set())
              }}
              className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                isSelectionMode 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-zinc-800 text-gray-300 hover:text-white border border-zinc-700'
              }`}
            >
              {isSelectionMode ? '取消选择' : '批量选择'}
            </button>
          )}
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {isSelectionMode && selectedImages.size > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">
              已选择 {selectedImages.size} 张图像
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBatchOperation('favorite')}
                disabled={batchLoading}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {batchLoading ? '处理中...' : '批量收藏'}
              </button>
              <button
                onClick={() => handleBatchOperation('unfavorite')}
                disabled={batchLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                取消收藏
              </button>
              <button
                onClick={() => handleBatchOperation('delete')}
                disabled={batchLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                批量删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图像网格 */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
          : 'space-y-4'
        }
      `}>
        {/* 生成中的占位符 */}
        {isGenerating && Array.from({ length: 4 }).map((_, i) => (
          <div key={`loading-${i}`} className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 animate-pulse">
            <div className="h-48 bg-zinc-700/50 rounded-t-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-gray-400 text-sm">生成中...</span>
              </div>
            </div>
            <div className="p-4">
              <div className="h-8 bg-zinc-700/30 rounded animate-pulse"></div>
            </div>
          </div>
        ))}

        {/* 图像列表 */}
        {filteredImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImages.has(image.id)}
            isSelectionMode={isSelectionMode}
            onSelect={(selected) => {
              const newSelection = new Set(selectedImages)
              if (selected) {
                newSelection.add(image.id)
              } else {
                newSelection.delete(image.id)
              }
              setSelectedImages(newSelection)
            }}
            onOperation={(operation) => handleImageOperation(image, operation)}
            onTagsUpdate={(tags) => {
              // 更新本地图像标签
              const updatedImages = images.map(img => 
                img.id === image.id ? { ...img, tags } : img
              )
              onImagesChange?.(updatedImages)
            }}
            userTags={userTags}
            isGuest={isGuest}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredImages.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchQuery ? '没有找到匹配的图像' : '还没有生成任何图像'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              清除搜索条件
            </button>
          )}
        </div>
      )}
    </div>
  )
} 