import { NextRequest, NextResponse } from 'next/server'
import { testSupabaseConnection } from '../../../lib/supabaseClient'

// GET /api/test/auth - 测试认证系统
export async function GET(request: NextRequest) {
  try {
    const tests = {
      environment: process.env.NODE_ENV,
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        connection: false
      },
      jwt: {
        secret: !!process.env.JWT_SECRET
      },
      services: {
        alicloud: !!process.env.ALICLOUD_ACCESS_KEY_ID,
        wechat: !!process.env.WECHAT_APP_ID,
        alipay: !!process.env.ALIPAY_APP_ID
      }
    }

    // 测试 Supabase 连接（仅在配置了的情况下）
    if (tests.supabase.url && tests.supabase.key) {
      try {
        tests.supabase.connection = await testSupabaseConnection()
      } catch (error) {
        console.error('Supabase 连接测试失败:', error)
        tests.supabase.connection = false
      }
    }

    return NextResponse.json({
      success: true,
      message: '认证系统测试结果',
      data: tests
    })

  } catch (error) {
    console.error('认证系统测试失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 