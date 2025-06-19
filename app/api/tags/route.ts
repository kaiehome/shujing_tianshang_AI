import { NextRequest, NextResponse } from 'next/server'
import { ImageService } from '../../lib/imageService'

// GET /api/tags - 获取用户的标签列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '用户ID必填' }, { status: 400 })
    }

    const tags = await ImageService.getUserTags(userId)
    
    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return NextResponse.json({ 
      error: '获取标签列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// POST /api/tags - 创建新标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, color } = body

    if (!userId || !name) {
      return NextResponse.json({ error: '用户ID和标签名称必填' }, { status: 400 })
    }

    const tag = await ImageService.createTag(userId, name, color)

    if (!tag) {
      return NextResponse.json({ error: '创建标签失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: tag
    })
  } catch (error) {
    console.error('创建标签失败:', error)
    return NextResponse.json({ 
      error: '创建标签失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 