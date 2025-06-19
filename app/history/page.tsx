'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  createdAt: string
  isFavorite: boolean
  tags: string[]
  dimensions: string
}

// 模拟数据 - 实际项目中这应该从API获取
const mockImages: GeneratedImage[] = [
  {
    id: '1',
    url: '/api/placeholder/400/400',
    prompt: '一只可爱的小猫咪在花园里玩耍',
    style: '卡通风格',
    createdAt: '2024-01-15T10:30:00Z',
    isFavorite: true,
    tags: ['动物', '可爱', '花园'],
    dimensions: '512x512'
  },
  {
    id: '2', 
    url: '/api/placeholder/400/400',
    prompt: '未来科技城市的夜景，霓虹灯闪烁',
    style: '科幻风格',
    createdAt: '2024-01-14T15:45:00Z',
    isFavorite: false,
    tags: ['科技', '城市', '夜景'],
    dimensions: '768x512'
  },
  {
    id: '3',
    url: '/api/placeholder/400/400', 
    prompt: '一个古老的图书馆，阳光透过窗户洒进来',
    style: '复古风格',
    createdAt: '2024-01-13T09:20:00Z',
    isFavorite: true,
    tags: ['图书馆', '阳光', '复古'],
    dimensions: '512x768'
  },
  {
    id: '4',
    url: '/api/placeholder/400/400',
    prompt: '山顶的日出，云海翻滚',
    style: '自然风格',
    createdAt: '2024-01-12T07:15:00Z',
    isFavorite: false,
    tags: ['自然', '日出', '山'],
    dimensions: '768x512'
  },
  {
    id: '5',
    url: '/api/placeholder/400/400',
    prompt: '抽象艺术作品，色彩斑斓的几何图形',
    style: '抽象风格',
    createdAt: '2024-01-11T14:30:00Z',
    isFavorite: false,
    tags: ['抽象', '艺术', '几何'],
    dimensions: '512x512'
  },
  {
    id: '6',
    url: '/api/placeholder/400/400',
    prompt: '咖啡店内的温馨场景，有人在阅读',
    style: '生活风格',
    createdAt: '2024-01-10T16:00:00Z',
    isFavorite: true,
    tags: ['咖啡', '阅读', '温馨'],
    dimensions: '512x768'
  }
]

export default function HistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'favorites'>('newest')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 模拟API调用加载图片
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 在实际项目中，这里应该调用真实的API
        // const response = await fetch('/api/images/user-history')
        // const data = await response.json()
        
        setImages(mockImages)
      } catch (error) {
        console.error('加载图片失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  // 筛选和排序图片
  const filteredImages = images
    .filter(image => {
      const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStyle = selectedStyle === 'all' || image.style === selectedStyle
      const matchesFavorites = !showFavoritesOnly || image.isFavorite
      
      return matchesSearch && matchesStyle && matchesFavorites
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'favorites':
          return b.isFavorite === a.isFavorite ? 0 : b.isFavorite ? 1 : -1
        default:
          return 0
      }
    })

  // 切换收藏状态
  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ))
  }

  // 选择图片
  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  // 批量操作
  const handleBatchDelete = () => {
    if (selectedImages.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedImages.length} 张图片吗？`)) {
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)))
      setSelectedImages([])
    }
  }

  const handleBatchFavorite = () => {
    if (selectedImages.length === 0) return
    setImages(prev => prev.map(img => 
      selectedImages.includes(img.id) ? { ...img, isFavorite: true } : img
    ))
    setSelectedImages([])
  }

  // 获取所有风格
  const allStyles = ['all', ...Array.from(new Set(images.map(img => img.style)))]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">加载您的创作历史...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              我的创作历史
            </h1>
            <p className="text-gray-400">
              共 {images.length} 张作品，筛选后显示 {filteredImages.length} 张
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={getLocalizedPath('/login', currentLocale)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              立即登录
            </Link>
            <Link 
              href={getLocalizedPath('/', currentLocale)}
              className="flex items-center gap-2 bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始创作
            </Link>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-xl p-6 border border-zinc-600/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索提示词或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Style Filter */}
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
            >
              {allStyles.map(style => (
                <option key={style} value={style}>
                  {style === 'all' ? '全部风格' : style}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'favorites')}
              className="bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="favorites">收藏优先</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-zinc-700/50 text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-zinc-700/50 text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">仅显示收藏</span>
            </label>

            {/* Batch Actions */}
            {selectedImages.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-400">已选择 {selectedImages.length} 项</span>
                <button
                  onClick={handleBatchFavorite}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                  批量收藏
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                >
                  批量删除
                </button>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  取消选择
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Images Grid/List */}
        {filteredImages.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`group bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-xl border border-zinc-600/50 hover:border-blue-400/70 transition-all duration-300 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}
              >
                {/* Selection Checkbox */}
                <div className={`absolute ${viewMode === 'grid' ? 'top-2 left-2' : 'left-2'} z-10`}>
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0 mr-4' : 'aspect-square mb-4'} overflow-hidden rounded-lg`}>
                  <Image
                    src={`https://picsum.photos/400/400?random=${image.id}`}
                    alt={image.prompt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
                      image.isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black/50 text-gray-300 hover:text-red-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full">
                      {image.style}
                    </span>
                    <span className="text-xs text-gray-400">{image.dimensions}</span>
                  </div>
                  
                  <p className={`text-gray-200 leading-snug mb-3 ${viewMode === 'list' ? 'text-sm' : 'text-sm'}`}>
                    {image.prompt.length > 60 && viewMode === 'grid' 
                      ? `${image.prompt.substring(0, 60)}...` 
                      : image.prompt
                    }
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.slice(0, viewMode === 'list' ? 5 : 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-zinc-700/50 text-gray-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDate(image.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        title="重新生成"
                        className="p-1.5 bg-zinc-700/50 hover:bg-blue-600 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        title="下载"
                        className="p-1.5 bg-zinc-700/50 hover:bg-green-600 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        title="删除"
                        className="p-1.5 bg-zinc-700/50 hover:bg-red-600 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm || selectedStyle !== 'all' || showFavoritesOnly 
                ? '没有找到匹配的作品' 
                : '还没有创作历史'
              }
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedStyle !== 'all' || showFavoritesOnly
                ? '尝试调整筛选条件或清空搜索'
                : '开始您的第一次AI图像创作吧！'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href={getLocalizedPath('/login', currentLocale)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                立即登录
              </Link>
              <Link 
                href={getLocalizedPath('/', currentLocale)}
                className="flex items-center gap-2 bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                开始创作
              </Link>
            </div>
          </div>
        )}

        {/* Pagination - if needed */}
        {filteredImages.length > 20 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600 text-white rounded transition-colors">
                上一页
              </button>
              <span className="px-4 py-2 text-gray-400">1 / 1</span>
              <button className="px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600 text-white rounded transition-colors">
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}