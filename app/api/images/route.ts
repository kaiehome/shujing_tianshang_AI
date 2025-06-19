import { NextRequest, NextResponse } from 'next/server'
import { ImageService } from '../../lib/imageService'
import { ImageSortBy, ImageSortOrder } from '../../lib/types'

// 请求验证函数
const validateGetParams = (searchParams: URLSearchParams) => {
  const userId = searchParams.get('userId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const sortBy = (searchParams.get('sortBy') || 'created_at') as ImageSortBy
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as ImageSortOrder

  if (!userId) {
    throw new Error('用户ID必填')
  }

  if (page < 1 || page > 1000) {
    throw new Error('页码必须在1-1000之间')
  }

  if (limit < 1 || limit > 100) {
    throw new Error('每页数量必须在1-100之间')
  }

  if (!['created_at', 'prompt', 'style', 'favorites'].includes(sortBy)) {
    throw new Error('无效的排序字段')
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new Error('无效的排序方向')
  }

  return { userId, page, limit, sortBy, sortOrder }
}

const validatePostData = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new Error('无效的请求数据')
  }

  if (!data.url || typeof data.url !== 'string') {
    throw new Error('图像URL必填')
  }

  if (!data.user_id || typeof data.user_id !== 'string') {
    throw new Error('用户ID必填')
  }

  // 验证URL格式
  try {
    new URL(data.url)
  } catch {
    throw new Error('无效的图像URL格式')
  }

  return data
}

// GET /api/images - 获取图像列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { userId, page, limit, sortBy, sortOrder } = validateGetParams(searchParams)

    // 添加请求头用于缓存
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5分钟缓存
    })

    const result = await ImageService.getUserImages(userId, page, limit, sortBy, sortOrder)

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasMore: page * limit < result.total
      }
    }, { headers })

  } catch (error) {
    console.error('获取图像列表失败:', error)
    
    const statusCode = error instanceof Error && error.message.includes('必填') ? 400 : 500
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '获取图像列表失败',
      code: 'GET_IMAGES_ERROR'
    }, { status: statusCode })
  }
}

// POST /api/images - 保存新图像
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = validatePostData(body)

    const savedImage = await ImageService.saveImage(validatedData)

    if (!savedImage) {
      return NextResponse.json({
        success: false,
        error: '保存图像失败',
        code: 'SAVE_FAILED'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: savedImage,
      message: '图像保存成功'
    }, { status: 201 })

  } catch (error) {
    console.error('保存图像失败:', error)
    
    const statusCode = error instanceof Error && error.message.includes('必填') ? 400 : 500
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '保存图像失败',
      code: 'SAVE_IMAGE_ERROR'
    }, { status: statusCode })
  }
}

// DELETE /api/images - 删除图像
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const imageId = searchParams.get('imageId')

    if (!userId || !imageId) {
      return NextResponse.json({
        success: false,
        error: '用户ID和图像ID必填',
        code: 'MISSING_PARAMS'
      }, { status: 400 })
    }

    const success = await ImageService.deleteImage(userId, imageId)

    if (!success) {
      return NextResponse.json({
        success: false,
        error: '删除图像失败',
        code: 'DELETE_FAILED'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '图像删除成功'
    })

  } catch (error) {
    console.error('删除图像失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '删除图像失败',
      code: 'DELETE_IMAGE_ERROR'
    }, { status: 500 })
  }
} 