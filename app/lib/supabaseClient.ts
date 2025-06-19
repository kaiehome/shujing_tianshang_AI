import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 开发模式检查
const isDevelopment = process.env.NODE_ENV === 'development'

// 创建 Supabase 客户端
let supabase: SupabaseClient | null = null

try {
  // 在开发模式下，如果没有配置 Supabase，使用模拟客户端
  if (isDevelopment && (!supabaseUrl || !supabaseKey)) {
    console.warn('⚠️ 开发模式: Supabase 未配置，使用内存存储')
    // 创建一个模拟的 Supabase 客户端
    supabase = {
      from: () => ({
        select: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ data: null, error: null }),
        getSession: () => Promise.resolve({ data: null, error: null })
      }
    } as unknown as SupabaseClient
  } else {
    // 生产模式或已配置 Supabase 的开发模式
    if (!supabaseUrl) {
      throw new Error('缺少环境变量: NEXT_PUBLIC_SUPABASE_URL')
    }
    if (!supabaseKey) {
      throw new Error('缺少环境变量: NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'ai-image-generator'
        }
      }
    })
  }
} catch (error) {
  console.error('Supabase 客户端初始化失败:', error)
  if (!isDevelopment) {
    throw error // 在生产模式下抛出错误
  }
  // 在开发模式下继续使用模拟客户端
  console.warn('⚠️ 开发模式: 使用模拟客户端继续运行')
}

// 测试连接函数
export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      if (isDevelopment) {
        console.log('✅ 开发模式: 使用内存存储，无需数据库连接')
        return true
      }
      throw new Error('Supabase 客户端未初始化')
    }

    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase 连接测试失败:', error)
      return false
    }
    
    console.log('✅ Supabase 连接测试成功')
    return true
  } catch (error) {
    console.error('Supabase 连接异常:', error)
    if (isDevelopment) {
      console.warn('⚠️ 开发模式: 继续使用内存存储')
      return true
    }
    return false
  }
}

// 导出 Supabase 客户端
export { supabase }