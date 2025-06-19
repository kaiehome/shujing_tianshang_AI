import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase客户端未初始化'
      }, { status: 500 })
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      tables: {}
    }

    // 检查OAuth相关表
    const oauthTables = [
      'user_oauth_accounts',
      'oauth_states', 
      'user_login_history'
    ]

    for (const tableName of oauthTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          results.tables[tableName] = {
            exists: false,
            error: error.message
          }
        } else {
          results.tables[tableName] = {
            exists: true,
            message: '表存在且可访问'
          }
        }
      } catch (err) {
        results.tables[tableName] = {
          exists: false,
          error: err instanceof Error ? err.message : '未知错误'
        }
      }
    }

    // 检查是否所有表都存在
    const allTablesExist = oauthTables.every(table => results.tables[table]?.exists)

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist ? 'OAuth表结构完整' : 'OAuth表结构不完整，需要执行数据库扩展',
      data: results
    })

  } catch (error) {
    console.error('OAuth表检查失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '检查失败'
    }, { status: 500 })
  }
} 