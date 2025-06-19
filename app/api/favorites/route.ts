import { NextRequest, NextResponse } from 'next/server'
import { ImageService } from '../../lib/imageService'

// GET /api/favorites - 获取用户收藏的图像
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '用户ID必填' }, { status: 400 })
    }

    const favoriteImages = await ImageService.getFavoriteImages(userId)
    
    return NextResponse.json({
      success: true,
      data: favoriteImages
    })
  } catch (error) {
    console.error('获取收藏图像失败:', error)
    return NextResponse.json({ 
      error: '获取收藏图像失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// POST /api/favorites - 添加图像到收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, imageId } = body

    if (!userId || !imageId) {
      return NextResponse.json({ error: '用户ID和图像ID必填' }, { status: 400 })
    }

    const success = await ImageService.addToFavorites(userId, imageId)

    if (!success) {
      return NextResponse.json({ error: '添加收藏失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '添加收藏成功'
    })
  } catch (error) {
    console.error('添加收藏失败:', error)
    return NextResponse.json({ 
      error: '添加收藏失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// DELETE /api/favorites - 从收藏中移除图像
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const imageId = searchParams.get('imageId')

    if (!userId || !imageId) {
      return NextResponse.json({ error: '用户ID和图像ID必填' }, { status: 400 })
    }

    const success = await ImageService.removeFromFavorites(userId, imageId)

    if (!success) {
      return NextResponse.json({ error: '移除收藏失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '移除收藏成功'
    })
  } catch (error) {
    console.error('移除收藏失败:', error)
    return NextResponse.json({ 
      error: '移除收藏失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 