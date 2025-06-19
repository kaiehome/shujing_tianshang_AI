import { supabase } from './supabaseClient'
import { ImageData, FavoriteImage, ImageTag, ImageTagRelation, ImageSortBy, ImageSortOrder } from './types'

// 检查supabase是否可用的辅助函数
function ensureSupabase() {
  if (!supabase) {
    throw new Error('数据库连接不可用')
  }
  return supabase
}

// 缓存配置
const CACHE_TTL = 5 * 60 * 1000 // 5分钟
const cache = new Map<string, { data: any; timestamp: number }>()

// 重试配置
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000

// 批量操作队列
interface BatchOperation {
  type: 'favorite' | 'unfavorite' | 'delete'
  imageIds: string[]
  userId: string
  timestamp: number
}

class BatchQueue {
  private queue: BatchOperation[] = []
  private processing = false
  private batchDelay = 1000 // 1秒延迟批处理

  add(operation: BatchOperation) {
    this.queue.push(operation)
    this.processBatch()
  }

  private async processBatch() {
    if (this.processing) return
    this.processing = true

    // 等待延迟，收集更多操作
    await new Promise(resolve => setTimeout(resolve, this.batchDelay))

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, 50) // 每批处理50个操作
      await this.executeBatch(batch)
    }

    this.processing = false
  }

  private async executeBatch(batch: BatchOperation[]) {
    // 按类型和用户分组
    const groups = new Map<string, BatchOperation[]>()
    
    for (const operation of batch) {
      const key = `${operation.userId}_${operation.type}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(operation)
    }

    // 并行执行每个组
    await Promise.allSettled(
      Array.from(groups.values()).map(group => this.executeGroup(group))
    )
  }

  private async executeGroup(operations: BatchOperation[]) {
    const firstOp = operations[0]
    const allImageIds = operations.flatMap(op => op.imageIds)

    try {
      switch (firstOp.type) {
        case 'favorite':
          await ImageService._batchFavorite(firstOp.userId, allImageIds)
          break
        case 'unfavorite':
          await ImageService._batchUnfavorite(firstOp.userId, allImageIds)
          break
        case 'delete':
          await ImageService._batchDelete(firstOp.userId, allImageIds)
          break
      }
    } catch (error) {
      console.error('批量操作失败:', error)
      // 可以实现重试逻辑
    }
  }
}

const batchQueue = new BatchQueue()

// 工具函数
const getCacheKey = (prefix: string, ...params: any[]) => 
  `${prefix}_${params.map(p => String(p)).join('_')}`

const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() })
}

const clearCachePattern = (pattern: string) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// 重试装饰器
const withRetry = async <T>(
  fn: () => Promise<T>, 
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (i === attempts - 1) throw error
      
      // 如果是网络错误或服务器错误，进行重试
      if (error.code === 'PGRST301' || error.code === 'PGRST116' || 
          error.message?.includes('network') || 
          error.message?.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        continue
      }
      
      throw error
    }
  }
  throw new Error('重试次数已用完')
}

// 数据验证函数
const validateImageData = (data: any): data is Partial<ImageData> => {
  return data && typeof data === 'object' && 
         (typeof data.url === 'string' || data.url === undefined)
}

const validateUserId = (userId: string): boolean => {
  return typeof userId === 'string' && userId.length > 0
}

export class ImageService {
  // 保存图像
  static async saveImage(imageData: Omit<ImageData, 'id' | 'timestamp'>): Promise<ImageData | null> {
    if (!validateImageData(imageData) || !validateUserId(imageData.user_id!)) {
      throw new Error('无效的图像数据')
    }

    return withRetry(async () => {
      const { data, error } = await ensureSupabase()
        .from('generated_images')
        .insert([{
          ...imageData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          favorite_images!left (id),
          image_tag_relations!left (
            tag_id,
            image_tags!inner (name, color)
          )
        `)
        .single()

      if (error) throw error

      // 清除相关缓存
      clearCachePattern(`images_${imageData.user_id}`)
      clearCachePattern(`favorites_${imageData.user_id}`)

      return this.transformImageData(data)
    })
  }

  // 获取用户图像列表 - 优化版本
  static async getUserImages(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    sortBy: ImageSortBy = 'created_at',
    sortOrder: ImageSortOrder = 'desc'
  ): Promise<{ images: ImageData[]; total: number }> {
    if (!validateUserId(userId)) {
      throw new Error('无效的用户ID')
    }

    const cacheKey = getCacheKey('images', userId, page, limit, sortBy, sortOrder)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    return withRetry(async () => {
      const offset = (page - 1) * limit

      // 构建排序子句
      let orderClause = 'created_at.desc'
      switch (sortBy) {
        case 'created_at':
          orderClause = `created_at.${sortOrder}`
          break
        case 'prompt':
          orderClause = `prompt.${sortOrder}.nullslast`
          break
        case 'style':
          orderClause = `style.${sortOrder}.nullslast`
          break
      }

      // 获取图像和总数
      const [imagesResponse, countResponse] = await Promise.all([
        ensureSupabase()
          .from('generated_images')
          .select(`
            *,
            favorite_images!left (id),
            image_tag_relations!left (
              tag_id,
              image_tags!inner (name, color)
            )
          `)
          .eq('user_id', userId)
          .order(orderClause.split('.')[0], { 
            ascending: orderClause.includes('asc'),
            nullsFirst: false
          })
          .range(offset, offset + limit - 1),

        ensureSupabase()
          .from('generated_images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
      ])

      if (imagesResponse.error) throw imagesResponse.error
      if (countResponse.error) throw countResponse.error

      const images = imagesResponse.data.map(item => this.transformImageData(item))
      const total = countResponse.count || 0

      const result = { images, total }
      setCachedData(cacheKey, result)
      
      return result
    })
  }

  // 获取收藏图像 - 优化版本
  static async getFavoriteImages(userId: string): Promise<ImageData[]> {
    if (!validateUserId(userId)) {
      throw new Error('无效的用户ID')
    }

    const cacheKey = getCacheKey('favorites', userId)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    return withRetry(async () => {
      const { data, error } = await ensureSupabase()
        .from('favorite_images')
        .select(`
          image_id,
          generated_images!inner (
            *,
            image_tag_relations!left (
              tag_id,
              image_tags!inner (name, color)
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const images = data.map(item => this.transformImageData({
        ...item.generated_images,
        favorite_images: [{ id: item.image_id }]
      }))

      setCachedData(cacheKey, images)
      return images
    })
  }

  // 删除图像 - 优化版本
  static async deleteImage(userId: string, imageId: string): Promise<boolean> {
    if (!validateUserId(userId) || !imageId) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      // 验证图像所有权
      const { data: ownership, error: ownershipError } = await ensureSupabase()
        .from('generated_images')
        .select('id')
        .eq('id', imageId)
        .eq('user_id', userId)
        .single()

      if (ownershipError || !ownership) {
        throw new Error('图像不存在或无权限删除')
      }

      // 删除图像（级联删除会处理相关记录）
      const { error } = await ensureSupabase()
        .from('generated_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', userId)

      if (error) throw error

      // 清除相关缓存
      clearCachePattern(`images_${userId}`)
      clearCachePattern(`favorites_${userId}`)

      return true
    })
  }

  // 添加收藏 - 优化版本
  static async addToFavorites(userId: string, imageId: string): Promise<boolean> {
    if (!validateUserId(userId) || !imageId) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      const { error } = await ensureSupabase()
        .from('favorite_images')
        .insert([{ user_id: userId, image_id: imageId }])

      if (error && !error.message.includes('duplicate')) {
        throw error
      }

      // 清除收藏缓存
      clearCachePattern(`favorites_${userId}`)

      return true
    })
  }

  // 移除收藏 - 优化版本
  static async removeFromFavorites(userId: string, imageId: string): Promise<boolean> {
    if (!validateUserId(userId) || !imageId) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      const { error } = await ensureSupabase()
        .from('favorite_images')
        .delete()
        .eq('user_id', userId)
        .eq('image_id', imageId)

      if (error) throw error

      // 清除收藏缓存
      clearCachePattern(`favorites_${userId}`)

      return true
    })
  }

  // 获取用户标签
  static async getUserTags(userId: string): Promise<ImageTag[]> {
    if (!validateUserId(userId)) {
      throw new Error('无效的用户ID')
    }

    const cacheKey = getCacheKey('tags', userId)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    return withRetry(async () => {
      const { data, error } = await ensureSupabase()
        .from('image_tags')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCachedData(cacheKey, data || [])
      return data || []
    })
  }

  // 创建标签
  static async createTag(userId: string, name: string, color?: string): Promise<ImageTag | null> {
    if (!validateUserId(userId) || !name?.trim()) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      const { data, error } = await ensureSupabase()
        .from('image_tags')
        .insert([{
          user_id: userId,
          name: name.trim(),
          color: color || '#3B82F6'
        }])
        .select()
        .single()

      if (error) throw error

      // 清除标签缓存
      clearCachePattern(`tags_${userId}`)

      return data
    })
  }

  // 为图像添加标签
  static async addTagToImage(imageId: string, tagId: string): Promise<boolean> {
    if (!imageId || !tagId) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      const { error } = await ensureSupabase()
        .from('image_tag_relations')
        .insert([{ image_id: imageId, tag_id: tagId }])

      if (error && !error.message.includes('duplicate')) {
        throw error
      }

      return true
    })
  }

  // 从图像移除标签
  static async removeTagFromImage(imageId: string, tagId: string): Promise<boolean> {
    if (!imageId || !tagId) {
      throw new Error('无效的参数')
    }

    return withRetry(async () => {
      const { error } = await ensureSupabase()
        .from('image_tag_relations')
        .delete()
        .eq('image_id', imageId)
        .eq('tag_id', tagId)

      if (error) throw error

      return true
    })
  }

  // 批量操作图像 - 优化版本
  static async batchUpdateImages(
    userId: string, 
    imageIds: string[], 
    operation: 'favorite' | 'unfavorite' | 'delete'
  ): Promise<boolean> {
    if (!validateUserId(userId) || !Array.isArray(imageIds) || imageIds.length === 0) {
      throw new Error('无效的参数')
    }

    // 验证所有图像的所有权
    const { data: ownership, error: ownershipError } = await ensureSupabase()
      .from('generated_images')
      .select('id')
      .eq('user_id', userId)
      .in('id', imageIds)

    if (ownershipError) throw ownershipError

    const ownedImageIds = ownership.map(item => item.id)
    const validImageIds = imageIds.filter(id => ownedImageIds.includes(id))

    if (validImageIds.length === 0) {
      throw new Error('没有有效的图像ID')
    }

    // 使用批量队列处理
    batchQueue.add({
      type: operation,
      imageIds: validImageIds,
      userId,
      timestamp: Date.now()
    })

    return true
  }

  // 内部批量操作方法
  static async _batchFavorite(userId: string, imageIds: string[]): Promise<void> {
    const insertData = imageIds.map(imageId => ({
      user_id: userId,
      image_id: imageId
    }))

    const { error } = await ensureSupabase()
      .from('favorite_images')
      .upsert(insertData, { onConflict: 'user_id,image_id' })

    if (error) throw error

    clearCachePattern(`favorites_${userId}`)
    clearCachePattern(`images_${userId}`)
  }

  static async _batchUnfavorite(userId: string, imageIds: string[]): Promise<void> {
    const { error } = await ensureSupabase()
      .from('favorite_images')
      .delete()
      .eq('user_id', userId)
      .in('image_id', imageIds)

    if (error) throw error

    clearCachePattern(`favorites_${userId}`)
    clearCachePattern(`images_${userId}`)
  }

  static async _batchDelete(userId: string, imageIds: string[]): Promise<void> {
    // 分批删除以避免请求过大
    const batchSize = 50
    for (let i = 0; i < imageIds.length; i += batchSize) {
      const batch = imageIds.slice(i, i + batchSize)
      
      const { error } = await ensureSupabase()
        .from('generated_images')
        .delete()
        .eq('user_id', userId)
        .in('id', batch)

      if (error) throw error
    }

    clearCachePattern(`favorites_${userId}`)
    clearCachePattern(`images_${userId}`)
  }

  // 数据转换函数
  private static transformImageData(data: any): ImageData {
    if (!data) throw new Error('无效的图像数据')

    const tags = data.image_tag_relations?.map((rel: any) => 
      rel.image_tags?.name
    ).filter(Boolean) || []

    return {
      id: data.id,
      url: data.url,
      prompt: data.prompt,
      negative_prompt: data.negative_prompt,
      style: data.style,
      parameters: data.parameters || {},
      batchId: data.batch_id,
      user_id: data.user_id,
      metadata: data.metadata || {},
      timestamp: new Date(data.created_at).getTime(),
      is_favorite: Array.isArray(data.favorite_images) && data.favorite_images.length > 0,
      tags
    }
  }

  // 清除缓存
  static clearCache(pattern?: string): void {
    if (pattern) {
      clearCachePattern(pattern)
    } else {
      cache.clear()
    }
  }

  // 获取缓存统计
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    }
  }
} 