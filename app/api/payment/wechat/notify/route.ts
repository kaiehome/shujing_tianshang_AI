import { NextRequest, NextResponse } from 'next/server'
import { handleWechatCallback } from '../../../../lib/payment/wechatService'

// 解析微信XML回调数据
function parseWechatXml(xml: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\w+>|<(\w+)>(.*?)<\/\w+>/g;
  let match;
  
  while ((match = regex.exec(xml)) !== null) {
    const key = match[1] || match[3];
    const value = match[2] || match[4];
    result[key] = value;
  }
  
  return result;
}

// 生成微信XML响应
function generateWechatXmlResponse(returnCode: string, returnMsg: string): string {
  return `<xml>
    <return_code><![CDATA[${returnCode}]]></return_code>
    <return_msg><![CDATA[${returnMsg}]]></return_msg>
  </xml>`;
}

export async function POST(request: NextRequest) {
  try {
    // 获取微信回调XML数据
    const xmlData = await request.text()
    console.log('收到微信支付回调:', xmlData)

    // 解析XML数据
    const params = parseWechatXml(xmlData)

    // 处理回调
    const result = await handleWechatCallback(params)

    if (result.success) {
      // 支付成功，返回SUCCESS给微信
      return new NextResponse(
        generateWechatXmlResponse('SUCCESS', 'OK'),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/xml'
          }
        }
      )
    } else {
      // 支付失败或其他状态
      return new NextResponse(
        generateWechatXmlResponse('FAIL', '处理失败'),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/xml'
          }
        }
      )
    }

  } catch (error) {
    console.error('处理微信支付回调失败:', error)
    
    // 返回FAIL给微信，微信会重试
    return new NextResponse(
      generateWechatXmlResponse('FAIL', '服务器错误'),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/xml'
        }
      }
    )
  }
}

// 支持GET请求用于测试
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}
  
  // 转换URLSearchParams为普通对象
  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }

  try {
    console.log('收到微信支付回调(GET):', params)
    
    const result = await handleWechatCallback(params)
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data
    })

  } catch (error) {
    console.error('处理微信支付回调失败:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : '处理回调失败'
    }, { status: 500 })
  }
} 