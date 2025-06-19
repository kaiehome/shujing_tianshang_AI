import { NextRequest, NextResponse } from 'next/server'
import { testSupabaseConnection } from '@/app/lib/supabaseClient'
import { aliCloudSms } from '@/app/lib/auth/alicloudSms'
import { alicloudConfig, jwtConfig } from '@/app/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      tests: {
        supabase: await testSupabaseConfig(),
        alicloud_sms: await testAliCloudSmsConfig(),
        jwt: testJwtConfig(),
        env_variables: testEnvironmentVariables()
      }
    }

    const allPassed = Object.values(results.tests).every(test => test.status === 'success')
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? '所有配置验证通过' : '部分配置存在问题',
      data: results
    }, { 
      status: allPassed ? 200 : 422 
    })

  } catch (error) {
    console.error('配置验证失败:', error)
    return NextResponse.json({
      success: false,
      error: '配置验证过程中发生错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// 测试Supabase配置
async function testSupabaseConfig() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anonKey) {
      return {
        status: 'error',
        message: '缺少必要的Supabase环境变量',
        details: {
          url: !!url,
          anon_key: !!anonKey,
          service_key: !!serviceKey
        }
      }
    }

    // 测试连接
    const connectionTest = await testSupabaseConnection()
    
    return {
      status: connectionTest ? 'success' : 'warning',
      message: connectionTest ? 'Supabase连接正常' : 'Supabase连接测试失败',
      details: {
        url: url.replace(/\/\/.+@/, '//***@'), // 隐藏敏感信息
        anon_key: anonKey.substring(0, 8) + '***',
        service_key: serviceKey ? serviceKey.substring(0, 8) + '***' : null,
        connection: connectionTest
      }
    }

  } catch (error) {
    return {
      status: 'error',
      message: 'Supabase配置测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 测试阿里云短信配置
async function testAliCloudSmsConfig() {
  try {
    const validation = aliCloudSms.validateConfig()
    
    if (!validation.valid) {
      return {
        status: 'error',
        message: '阿里云短信配置不完整',
        details: {
          missing: validation.missing,
          available: {
            access_key_id: !!alicloudConfig.accessKeyId,
            access_key_secret: !!alicloudConfig.accessKeySecret,
            sign_name: !!alicloudConfig.signName,
            template_code: !!alicloudConfig.templateCode
          }
        }
      }
    }

    // 在生产环境中，可以发送测试短信到指定号码
    // 这里只验证配置完整性，不实际发送
    return {
      status: 'success',
      message: '阿里云短信配置完整',
      details: {
        access_key_id: alicloudConfig.accessKeyId.substring(0, 8) + '***',
        sign_name: alicloudConfig.signName,
        template_code: alicloudConfig.templateCode,
        endpoint: alicloudConfig.endpoint
      }
    }

  } catch (error) {
    return {
      status: 'error',
      message: '阿里云短信配置测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 测试JWT配置
function testJwtConfig() {
  try {
    const secret = jwtConfig.secret
    
    if (!secret || secret === 'default-jwt-secret') {
      return {
        status: 'warning',
        message: 'JWT密钥未配置或使用默认值',
        details: {
          secret_configured: !!secret,
          using_default: secret === 'default-jwt-secret',
          algorithm: jwtConfig.algorithm
        }
      }
    }

    return {
      status: 'success',
      message: 'JWT配置正常',
      details: {
        secret_length: secret.length,
        algorithm: jwtConfig.algorithm,
        expires_in: jwtConfig.expiresIn
      }
    }

  } catch (error) {
    return {
      status: 'error',
      message: 'JWT配置测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 测试环境变量
function testEnvironmentVariables() {
  const requiredVars = [
    'NODE_ENV',
    'NEXTAUTH_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const optionalVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'ALICLOUD_ACCESS_KEY_ID',
    'ALICLOUD_ACCESS_KEY_SECRET',
    'ALICLOUD_SMS_SIGN_NAME',
    'ALICLOUD_SMS_TEMPLATE_CODE',
    'WECHAT_APP_ID',
    'ALIPAY_APP_ID',
    'OPENAI_API_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  const optional = optionalVars.filter(varName => !process.env[varName])
  const configured = [
    ...requiredVars.filter(varName => !!process.env[varName]),
    ...optionalVars.filter(varName => !!process.env[varName])
  ]

  return {
    status: missing.length === 0 ? 'success' : 'error',
    message: missing.length === 0 
      ? '所有必需的环境变量已配置' 
      : `缺少 ${missing.length} 个必需的环境变量`,
    details: {
      required_missing: missing,
      optional_missing: optional,
      configured: configured.length,
      environment: process.env.NODE_ENV
    }
  }
}

// POST方法用于测试特定功能
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params } = body

    switch (action) {
      case 'test_sms':
        return await testSmsDelivery(params.phone)
      
      case 'test_db_write':
        return await testDatabaseWrite()
      
      default:
        return NextResponse.json({
          success: false,
          error: '不支持的测试操作'
        }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '测试请求处理失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// 测试短信发送
async function testSmsDelivery(phone: string) {
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return NextResponse.json({
      success: false,
      error: '请提供有效的手机号码'
    }, { status: 400 })
  }

  try {
    const result = await aliCloudSms.sendSms(phone, '123456')
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? '测试短信发送成功' : '测试短信发送失败',
      error: result.error,
      data: {
        phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '短信发送测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// 测试数据库写入
async function testDatabaseWrite() {
  try {
    const { supabase } = await import('@/app/lib/supabaseClient')
    
    if (!supabase) {
      throw new Error('Supabase客户端未初始化')
    }

    // 创建测试记录
    const testData = {
      phone: '13800000000',
      code: '123456',
      type: 'test',
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    }

    const { data, error } = await supabase
      .from('sms_verifications')
      .insert([testData])
      .select()
      .single()

    if (error) {
      throw error
    }

    // 立即删除测试记录
    await supabase
      .from('sms_verifications')
      .delete()
      .eq('id', data.id)

    return NextResponse.json({
      success: true,
      message: '数据库写入测试成功',
      data: {
        test_record_id: data.id,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '数据库写入测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 