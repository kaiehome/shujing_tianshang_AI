// 图像相关类型定义
export interface ImageData {
  id: string
  url: string
  timestamp: number
  prompt?: string
  negative_prompt?: string
  style?: string
  parameters?: {
    guidance_scale?: number
    num_inference_steps?: number
    width?: number
    height?: number
    seed?: number
  }
  batchId?: string
  user_id?: string
  is_favorite?: boolean
  tags?: string[]
  metadata?: {
    model?: string
    version?: string
    service?: string
  }
}

// 收藏图像类型
export interface FavoriteImage {
  id: string
  user_id: string
  image_id: string
  created_at: string
  image?: ImageData
}

// 图像标签类型
export interface ImageTag {
  id: string
  name: string
  color?: string
  user_id: string
  created_at: string
}

// 图像标签关联类型
export interface ImageTagRelation {
  id: string
  image_id: string
  tag_id: string
  created_at: string
}

// 图像操作类型
export type ImageOperation = 'download' | 'favorite' | 'unfavorite' | 'edit' | 'delete' | 'share' | 'tag'

// 图像预览模式
export type ImagePreviewMode = 'grid' | 'masonry' | 'list'

// 图像排序方式
export type ImageSortBy = 'created_at' | 'updated_at' | 'prompt' | 'style' | 'favorites'
export type ImageSortOrder = 'asc' | 'desc' 