import { NextRequest, NextResponse } from 'next/server'
import { ImageService } from '../../../lib/imageService'

type BatchOperation = 'favorite' | 'unfavorite' | 'delete'

// POST /api/images/batch - 批量操作图像
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, imageIds, operation }: { 
      userId: string
      imageIds: string[]
      operation: BatchOperation 
    } = body

    if (!userId || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ 
        error: '用户ID和图像ID列表必填' 
      }, { status: 400 })
    }

    if (!['favorite', 'unfavorite', 'delete'].includes(operation)) {
      return NextResponse.json({ 
        error: '无效的操作类型' 
      }, { status: 400 })
    }

    // 执行批量操作
    const success = await ImageService.batchUpdateImages(userId, imageIds, operation)

    if (!success) {
      return NextResponse.json({ 
        error: `批量${operation}操作失败` 
      }, { status: 500 })
    }

    // 返回成功结果
    const operationNames: Record<BatchOperation, string> = {
      favorite: '收藏',
      unfavorite: '取消收藏',
      delete: '删除'
    }

    return NextResponse.json({
      success: true,
      message: `成功${operationNames[operation]}${imageIds.length}张图像`,
      data: {
        operation,
        imageIds,
        count: imageIds.length
      }
    })
  } catch (error) {
    console.error('批量操作失败:', error)
    return NextResponse.json({ 
      error: '批量操作失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 