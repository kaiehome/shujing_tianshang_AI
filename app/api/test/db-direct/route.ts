import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface TestResult {
  exists: boolean
  error?: string
  code?: string
  message?: string
  insert_test?: {
    success: boolean
    error?: string
    code?: string
    message?: string
    test_id?: string
  }
}

interface ConnectionResult {
  success: boolean
  error?: string
  code?: string
  message?: string
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase配置缺失',
        details: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      }, { status: 400 })
    }

    // 直接创建客户端
    const client = createClient(supabaseUrl, supabaseKey)
    
    const results: {
      connection: ConnectionResult | null
      tables: { [key: string]: TestResult }
      timestamp: string
    } = {
      connection: null,
      tables: {},
      timestamp: new Date().toISOString()
    }

    // 测试基本连接
    try {
      const { data, error } = await client
        .from('users')
        .select('count')
        .limit(1)
      
      if (error) {
        results.connection = {
          success: false,
          error: error.message,
          code: error.code
        }
      } else {
        results.connection = {
          success: true,
          message: 'users表连接成功'
        }
      }
    } catch (error) {
      results.connection = {
        success: false,
        error: error instanceof Error ? error.message : '连接异常'
      }
    }

    // 测试每个表的存在性
    const tablesToTest = ['users', 'sms_verifications', 'generated_images']
    
    for (const table of tablesToTest) {
      try {
        const { data, error } = await client
          .from(table)
          .select('count')
          .limit(0)
        
        if (error) {
          results.tables[table] = {
            exists: false,
            error: error.message,
            code: error.code
          }
        } else {
          results.tables[table] = {
            exists: true,
            message: '表存在且可访问'
          }
        }
      } catch (error) {
        results.tables[table] = {
          exists: false,
          error: error instanceof Error ? error.message : '未知错误'
        }
      }
    }

    // 尝试插入测试数据到sms_verifications表
    if (results.tables['sms_verifications']?.exists) {
      try {
        const testData = {
          phone: '13800000000',
          code: '123456',
          type: 'test',
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        }

        const { data: insertData, error: insertError } = await client
          .from('sms_verifications')
          .insert([testData])
          .select()
          .single()

        if (insertError) {
          results.tables['sms_verifications'].insert_test = {
            success: false,
            error: insertError.message,
            code: insertError.code
          }
        } else {
          // 立即删除测试数据
          await client
            .from('sms_verifications')
            .delete()
            .eq('id', insertData.id)

          results.tables['sms_verifications'].insert_test = {
            success: true,
            message: '插入和删除测试成功',
            test_id: insertData.id
          }
        }
      } catch (error) {
        results.tables['sms_verifications'].insert_test = {
          success: false,
          error: error instanceof Error ? error.message : '插入测试失败'
        }
      }
    }

    const allTablesExist = Object.values(results.tables).every((table: TestResult) => table.exists)
    const overallSuccess = results.connection?.success && allTablesExist

    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess ? '数据库配置验证通过' : '数据库配置存在问题',
      data: results
    }, { 
      status: overallSuccess ? 200 : 422 
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '数据库测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 