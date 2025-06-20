"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ImageData, ImageTag, ImageSortBy, ImageSortOrder } from '../lib/types'
import { ImageService } from '../lib/imageService'

interface UseImageManagerOptions {
  userId?: string
  autoLoad?: boolean
  pageSize?: number
  cacheKey?: string
}

interface UseImageManagerReturn {
  // 状态
  images: ImageData[]
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  totalCount: number
  isGenerating: boolean
  
  // 图像操作
  saveImage: (imageData: Omit<ImageData, 'id' | 'timestamp'>) => Promise<ImageData | null>
  deleteImage: (imageId: string) => Promise<boolean>
  toggleFavorite: (imageId: string, isFavorite: boolean) => Promise<boolean>
  
  // 标签操作
  userTags: ImageTag[]
  createTag: (name: string, color?: string) => Promise<ImageTag | null>
  addTagToImage: (imageId: string, tagId: string) => Promise<boolean>
  removeTagFromImage: (imageId: string, tagId: string) => Promise<boolean>
  
  // 批量操作
  batchFavorite: (imageIds: string[]) => Promise<boolean>
  batchUnfavorite: (imageIds: string[]) => Promise<boolean>
  batchDelete: (imageIds: string[]) => Promise<boolean>
  
  // 数据加载
  loadImages: (page?: number, sortBy?: ImageSortBy, sortOrder?: ImageSortOrder) => Promise<void>
  loadMoreImages: () => Promise<void>
  refreshImages: () => Promise<void>
  loadFavorites: () => Promise<void>
  
  // 实用方法
  updateImageInList: (imageId: string, updates: Partial<ImageData>) => void
  removeImageFromList: (imageId: string) => void
  clearCache: () => void
}

// 全局缓存对象
const imageCache = new Map<string, { data: any; timestamp: number; ttl: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

// 缓存工具函数
const getCachedData = (key: string) => {
  const cached = imageCache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  imageCache.delete(key)
  return null
}

const setCachedData = (key: string, data: any, ttl: number = CACHE_TTL) => {
  imageCache.set(key, { data, timestamp: Date.now(), ttl })
}

// 防抖Hook
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}

export function useImageManager({
  userId,
  autoLoad = true,
  pageSize = 20,
  cacheKey = 'default'
}: UseImageManagerOptions = {}): UseImageManagerReturn {
  // 状态管理
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [userTags, setUserTags] = useState<ImageTag[]>([])
  const [sortBy, setSortBy] = useState<ImageSortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<ImageSortOrder>('desc')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Refs for performance optimization
  const abortControllerRef = useRef<AbortController | null>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cacheKeyRef = useRef(`${userId}_${cacheKey}`)
  
  // 更新缓存键
  useEffect(() => {
    cacheKeyRef.current = `${userId}_${cacheKey}`
  }, [userId, cacheKey])

  // 防抖的加载函数
  const debouncedLoadRequest = useDebounce(loading, 300)

  // 批量操作队列
  const [batchQueue, setBatchQueue] = useState<{
    operation: string
    imageIds: string[]
    timestamp: number
  }[]>([])

  // 处理批量操作队列
  useEffect(() => {
    if (batchQueue.length === 0) return

    const processBatch = async () => {
      const now = Date.now()
      const oldOperations = batchQueue.filter(op => now - op.timestamp > 1000) // 1秒延迟批处理
      
      if (oldOperations.length === 0) return

      for (const operation of oldOperations) {
        try {
          await ImageService.batchUpdateImages(userId!, operation.imageIds, operation.operation as any)
          setBatchQueue(prev => prev.filter(op => op !== operation))
        } catch (error) {
          console.error('批量操作失败:', error)
        }
      }
    }

    const timer = setTimeout(processBatch, 1000)
    return () => clearTimeout(timer)
  }, [batchQueue, userId])

  // 优化的用户标签加载
  const loadUserTags = useCallback(async () => {
    if (!userId) return
    
    const cacheKey = `tags_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      setUserTags(cached)
      return
    }
    
    try {
      const tags = await ImageService.getUserTags(userId)
      setUserTags(tags)
      setCachedData(cacheKey, tags, CACHE_TTL)
    } catch (error) {
      console.error('加载用户标签失败:', error)
    }
  }, [userId])

  // 优化的图像加载函数
  const loadImages = useCallback(async (
    page: number = 1, 
    newSortBy: ImageSortBy = sortBy, 
    newSortOrder: ImageSortOrder = sortOrder
  ) => {
    if (!userId) return

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // 缓存键包含排序参数
    const cacheKey = `images_${userId}_${page}_${newSortBy}_${newSortOrder}_${pageSize}`
    
    // 检查缓存
    if (page === 1) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setImages(cached.images)
        setTotalCount(cached.total)
        setHasMore(cached.hasMore)
        setCurrentPage(page)
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
        return
      }
    }

    setLoading(true)
    setError(null)

    // 添加加载超时
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      if (!abortController.signal.aborted) {
        setError('加载超时，请重试')
        setLoading(false)
      }
    }, 15000) // 15秒超时

    try {
      const result = await ImageService.getUserImages(userId, page, pageSize, newSortBy, newSortOrder)
      
      if (abortController.signal.aborted) return
      
      if (page === 1) {
        setImages(result.images)
        // 缓存第一页数据
        setCachedData(cacheKey, {
          images: result.images,
          total: result.total,
          hasMore: result.images.length === pageSize && result.images.length < result.total
        }, CACHE_TTL)
      } else {
        setImages(prev => {
          // 避免重复数据
          const existingIds = new Set(prev.map(img => img.id))
          const newImages = result.images.filter(img => !existingIds.has(img.id))
          return [...prev, ...newImages]
        })
      }
      
      setTotalCount(result.total)
      setCurrentPage(page)
      setSortBy(newSortBy)
      setSortOrder(newSortOrder)
      setHasMore(result.images.length === pageSize && result.images.length < result.total)
    } catch (error: any) {
      if (error.name === 'AbortError') return
      console.error('加载图像失败:', error)
      setError(error instanceof Error ? error.message : '加载图像失败')
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [userId, pageSize, sortBy, sortOrder])

  // 优化的加载更多
  const loadMoreImages = useCallback(async () => {
    if (!hasMore || loading) return
    await loadImages(currentPage + 1, sortBy, sortOrder)
  }, [hasMore, loading, currentPage, loadImages, sortBy, sortOrder])

  // 优化的刷新函数
  const refreshImages = useCallback(async () => {
    // 清除相关缓存
    const pattern = `images_${userId}_`
    for (const key of imageCache.keys()) {
      if (key.startsWith(pattern)) {
        imageCache.delete(key)
      }
    }
    
    setCurrentPage(1)
    await loadImages(1, sortBy, sortOrder)
  }, [loadImages, sortBy, sortOrder, userId])

  // 优化的收藏加载
  const loadFavorites = useCallback(async () => {
    if (!userId) return

    const cacheKey = `favorites_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      setImages(cached)
      setTotalCount(cached.length)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const favoriteImages = await ImageService.getFavoriteImages(userId)
      setImages(favoriteImages)
      setTotalCount(favoriteImages.length)
      setHasMore(false)
      setCachedData(cacheKey, favoriteImages, CACHE_TTL)
    } catch (error) {
      console.error('加载收藏图像失败:', error)
      setError(error instanceof Error ? error.message : '加载收藏图像失败')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // 优化的保存图像
  const saveImage = useCallback(async (imageData: Omit<ImageData, 'id' | 'timestamp'>) => {
    if (!userId) return null

    try {
      const savedImage = await ImageService.saveImage({
        ...imageData,
        user_id: userId
      })
      
      if (savedImage) {
        setImages(prev => [savedImage, ...prev])
        setTotalCount(prev => prev + 1)
        
        // 清除相关缓存
        const pattern = `images_${userId}_`
        for (const key of imageCache.keys()) {
          if (key.startsWith(pattern)) {
            imageCache.delete(key)
          }
        }
      }
      
      return savedImage
    } catch (error) {
      console.error('保存图像失败:', error)
      setError(error instanceof Error ? error.message : '保存图像失败')
      return null
    }
  }, [userId])

  // 优化的删除图像
  const deleteImage = useCallback(async (imageId: string) => {
    if (!userId) return false

    // 乐观更新
    const originalImages = images
    setImages(prev => prev.filter(img => img.id !== imageId))
    setTotalCount(prev => prev - 1)

    try {
      const success = await ImageService.deleteImage(userId, imageId)
      
      if (!success) {
        // 回滚乐观更新
        setImages(originalImages)
        setTotalCount(prev => prev + 1)
      } else {
        // 清除相关缓存
        const pattern = `images_${userId}_`
        for (const key of imageCache.keys()) {
          if (key.startsWith(pattern)) {
            imageCache.delete(key)
          }
        }
      }
      
      return success
    } catch (error) {
      // 回滚乐观更新
      setImages(originalImages)
      setTotalCount(prev => prev + 1)
      console.error('删除图像失败:', error)
      setError(error instanceof Error ? error.message : '删除图像失败')
      return false
    }
  }, [userId, images])

  // 优化的收藏切换
  const toggleFavorite = useCallback(async (imageId: string, isFavorite: boolean) => {
    if (!userId) return false

    // 乐观更新
    updateImageInList(imageId, { is_favorite: isFavorite })

    try {
      const success = isFavorite 
        ? await ImageService.addToFavorites(userId, imageId)
        : await ImageService.removeFromFavorites(userId, imageId)
      
      if (!success) {
        // 回滚乐观更新
        updateImageInList(imageId, { is_favorite: !isFavorite })
      } else {
        // 清除收藏缓存
        imageCache.delete(`favorites_${userId}`)
      }
      
      return success
    } catch (error) {
      // 回滚乐观更新
      updateImageInList(imageId, { is_favorite: !isFavorite })
      console.error('切换收藏状态失败:', error)
      setError(error instanceof Error ? error.message : '操作失败')
      return false
    }
  }, [userId])

  // 优化的标签创建
  const createTag = useCallback(async (name: string, color?: string) => {
    if (!userId) return null

    try {
      const tag = await ImageService.createTag(userId, name, color)
      
      if (tag) {
        setUserTags(prev => [tag, ...prev])
        // 更新缓存
        const cacheKey = `tags_${userId}`
        const currentTags = getCachedData(cacheKey) || userTags
        setCachedData(cacheKey, [tag, ...currentTags], CACHE_TTL)
      }
      
      return tag
    } catch (error) {
      console.error('创建标签失败:', error)
      setError(error instanceof Error ? error.message : '创建标签失败')
      return null
    }
  }, [userId, userTags])

  // 优化的标签操作
  const addTagToImage = useCallback(async (imageId: string, tagId: string) => {
    try {
      const success = await ImageService.addTagToImage(imageId, tagId)
      
      if (success) {
        const tag = userTags.find(t => t.id === tagId)
        if (tag) {
          updateImageInList(imageId, {
            tags: [...(images.find(img => img.id === imageId)?.tags || []), tag.name]
          })
        }
      }
      
      return success
    } catch (error) {
      console.error('添加标签失败:', error)
      setError(error instanceof Error ? error.message : '添加标签失败')
      return false
    }
  }, [userTags, images])

  const removeTagFromImage = useCallback(async (imageId: string, tagId: string) => {
    try {
      const success = await ImageService.removeTagFromImage(imageId, tagId)
      
      if (success) {
        const tag = userTags.find(t => t.id === tagId)
        if (tag) {
          const currentImage = images.find(img => img.id === imageId)
          updateImageInList(imageId, {
            tags: currentImage?.tags?.filter(t => t !== tag.name) || []
          })
        }
      }
      
      return success
    } catch (error) {
      console.error('移除标签失败:', error)
      setError(error instanceof Error ? error.message : '移除标签失败')
      return false
    }
  }, [userTags, images])

  // 优化的批量操作
  const batchFavorite = useCallback(async (imageIds: string[]) => {
    if (!userId || imageIds.length === 0) return false

    // 乐观更新
    setImages(prev => prev.map(img => 
      imageIds.includes(img.id) ? { ...img, is_favorite: true } : img
    ))

    try {
      const success = await ImageService.batchUpdateImages(userId, imageIds, 'favorite')
      
      if (!success) {
        // 回滚乐观更新
        setImages(prev => prev.map(img => 
          imageIds.includes(img.id) ? { ...img, is_favorite: false } : img
        ))
      } else {
        // 清除收藏缓存
        imageCache.delete(`favorites_${userId}`)
      }
      
      return success
    } catch (error) {
      // 回滚乐观更新
      setImages(prev => prev.map(img => 
        imageIds.includes(img.id) ? { ...img, is_favorite: false } : img
      ))
      console.error('批量收藏失败:', error)
      setError(error instanceof Error ? error.message : '批量收藏失败')
      return false
    }
  }, [userId])

  const batchUnfavorite = useCallback(async (imageIds: string[]) => {
    if (!userId || imageIds.length === 0) return false

    // 乐观更新
    setImages(prev => prev.map(img => 
      imageIds.includes(img.id) ? { ...img, is_favorite: false } : img
    ))

    try {
      const success = await ImageService.batchUpdateImages(userId, imageIds, 'unfavorite')
      
      if (!success) {
        // 回滚乐观更新
        setImages(prev => prev.map(img => 
          imageIds.includes(img.id) ? { ...img, is_favorite: true } : img
        ))
      } else {
        // 清除收藏缓存
        imageCache.delete(`favorites_${userId}`)
      }
      
      return success
    } catch (error) {
      // 回滚乐观更新
      setImages(prev => prev.map(img => 
        imageIds.includes(img.id) ? { ...img, is_favorite: true } : img
      ))
      console.error('批量取消收藏失败:', error)
      setError(error instanceof Error ? error.message : '批量取消收藏失败')
      return false
    }
  }, [userId])

  const batchDelete = useCallback(async (imageIds: string[]) => {
    if (!userId || imageIds.length === 0) return false

    // 乐观更新
    const originalImages = images
    setImages(prev => prev.filter(img => !imageIds.includes(img.id)))
    setTotalCount(prev => prev - imageIds.length)

    try {
      const success = await ImageService.batchUpdateImages(userId, imageIds, 'delete')
      
      if (!success) {
        // 回滚乐观更新
        setImages(originalImages)
        setTotalCount(prev => prev + imageIds.length)
      } else {
        // 清除相关缓存
        const pattern = `images_${userId}_`
        for (const key of imageCache.keys()) {
          if (key.startsWith(pattern)) {
            imageCache.delete(key)
          }
        }
      }
      
      return success
    } catch (error) {
      // 回滚乐观更新
      setImages(originalImages)
      setTotalCount(prev => prev + imageIds.length)
      console.error('批量删除失败:', error)
      setError(error instanceof Error ? error.message : '批量删除失败')
      return false
    }
  }, [userId, images])

  // 优化的更新函数
  const updateImageInList = useCallback((imageId: string, updates: Partial<ImageData>) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    ))
  }, [])

  const removeImageFromList = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    setTotalCount(prev => prev - 1)
  }, [])

  // 清除缓存函数
  const clearCache = useCallback(() => {
    const pattern = cacheKeyRef.current
    for (const key of imageCache.keys()) {
      if (key.startsWith(pattern)) {
        imageCache.delete(key)
      }
    }
  }, [])

  // 自动清理缓存
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now()
      for (const [key, value] of imageCache.entries()) {
        if (now - value.timestamp > value.ttl) {
          imageCache.delete(key)
        }
      }
    }

    const interval = setInterval(cleanup, 60000) // 每分钟清理一次
    return () => clearInterval(interval)
  }, [])

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  // 初始化加载
  useEffect(() => {
    if (userId && autoLoad) {
      loadImages()
      loadUserTags()
    }
  }, [userId, autoLoad])

  // Memoized返回值
  return useMemo(() => ({
    // 状态
    images,
    loading: debouncedLoadRequest,
    error,
    hasMore,
    currentPage,
    totalCount,
    isGenerating,
    
    // 图像操作
    saveImage,
    deleteImage,
    toggleFavorite,
    
    // 标签操作
    userTags,
    createTag,
    addTagToImage,
    removeTagFromImage,
    
    // 批量操作
    batchFavorite,
    batchUnfavorite,
    batchDelete,
    
    // 数据加载
    loadImages,
    loadMoreImages,
    refreshImages,
    loadFavorites,
    
    // 实用方法
    updateImageInList,
    removeImageFromList,
    clearCache
  }), [
    images, debouncedLoadRequest, error, hasMore, currentPage, totalCount, isGenerating,
    saveImage, deleteImage, toggleFavorite,
    userTags, createTag, addTagToImage, removeTagFromImage,
    batchFavorite, batchUnfavorite, batchDelete,
    loadImages, loadMoreImages, refreshImages, loadFavorites,
    updateImageInList, removeImageFromList, clearCache
  ])
} 