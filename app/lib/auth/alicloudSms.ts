import { alicloudConfig } from './config'
import crypto from 'crypto'

// 阿里云短信API接口
interface AliCloudSmsResponse {
  Code: string
  Message: string
  RequestId: string
  BizId?: string
}

// 构建阿里云API签名
function buildSignature(params: Record<string, string>, secret: string): string {
  // 按参数名升序排列
  const sortedKeys = Object.keys(params).sort()
  
  // 构建查询字符串
  const queryString = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  // 构建待签名字符串
  const stringToSign = `POST&${encodeURIComponent('/')}&${encodeURIComponent(queryString)}`
  
  // 计算签名
  const hmac = crypto.createHmac('sha1', secret + '&')
  hmac.update(stringToSign)
  return hmac.digest('base64')
}

// 生成随机字符串
function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 格式化时间戳
function getTimestamp(): string {
  return new Date().toISOString()
}

export class AliCloudSmsService {
  private accessKeyId: string
  private accessKeySecret: string
  private signName: string
  private templateCode: string
  private endpoint: string

  constructor() {
    this.accessKeyId = alicloudConfig.accessKeyId
    this.accessKeySecret = alicloudConfig.accessKeySecret
    this.signName = alicloudConfig.signName
    this.templateCode = alicloudConfig.templateCode
    this.endpoint = alicloudConfig.endpoint
  }

  /**
   * 发送短信验证码
   */
  async sendSms(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 检查配置
      if (!this.accessKeyId || !this.accessKeySecret || !this.signName || !this.templateCode) {
        throw new Error('阿里云短信配置不完整')
      }

      // 构建请求参数
      const params: Record<string, string> = {
        'AccessKeyId': this.accessKeyId,
        'Action': 'SendSms',
        'Format': 'JSON',
        'PhoneNumbers': phone,
        'SignName': this.signName,
        'TemplateCode': this.templateCode,
        'TemplateParam': JSON.stringify({ code }),
        'Version': '2017-05-25',
        'SignatureMethod': 'HMAC-SHA1',
        'Timestamp': getTimestamp(),
        'SignatureVersion': '1.0',
        'SignatureNonce': generateNonce()
      }

      // 生成签名
      params.Signature = buildSignature(params, this.accessKeySecret)

      // 构建请求体
      const formData = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // 发送请求
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const result: AliCloudSmsResponse = await response.json()

      // 检查响应结果
      if (result.Code === 'OK') {
        console.log(`短信发送成功: ${phone} -> ${code}`)
        return { success: true }
      } else {
        console.error('短信发送失败:', result)
        return { 
          success: false, 
          error: this.getErrorMessage(result.Code, result.Message) 
        }
      }

    } catch (error) {
      console.error('短信发送异常:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      }
    }
  }

  /**
   * 获取错误信息
   */
  private getErrorMessage(code: string, message: string): string {
    const errorMap: Record<string, string> = {
      'isv.BUSINESS_LIMIT_CONTROL': '业务限流',
      'isv.DAY_LIMIT_CONTROL': '当日发送量超限',
      'isv.SMS_CONTENT_ILLEGAL': '短信内容包含违法信息',
      'isv.SMS_SIGN_ILLEGAL': '短信签名不合法',
      'isv.SMS_TEMPLATE_ILLEGAL': '短信模板不合法',
      'isv.INVALID_PARAMETERS': '参数异常',
      'isv.MOBILE_NUMBER_ILLEGAL': '非法手机号',
      'isv.MOBILE_COUNT_OVER_LIMIT': '手机号码数量超过限制',
      'isv.TEMPLATE_MISSING_PARAMETERS': '模板缺少变量',
      'isv.INVALID_JSON_PARAM': 'JSON参数不合法',
      'isv.BLACK_KEY_CONTROL_LIMIT': '黑名单管控',
      'isv.PARAM_LENGTH_LIMIT': '参数超出长度限制',
      'isv.PARAM_NOT_SUPPORT_URL': '不支持URL',
      'isv.AMOUNT_NOT_ENOUGH': '账户余额不足'
    }

    return errorMap[code] || `${message} (${code})`
  }

  /**
   * 查询发送记录
   */
  async querySendDetails(phone: string, date: string, bizId?: string): Promise<any> {
    try {
      const params: Record<string, string> = {
        'AccessKeyId': this.accessKeyId,
        'Action': 'QuerySendDetails',
        'Format': 'JSON',
        'PhoneNumber': phone,
        'SendDate': date,
        'PageSize': '50',
        'CurrentPage': '1',
        'Version': '2017-05-25',
        'SignatureMethod': 'HMAC-SHA1',
        'Timestamp': getTimestamp(),
        'SignatureVersion': '1.0',
        'SignatureNonce': generateNonce()
      }

      if (bizId) {
        params.BizId = bizId
      }

      params.Signature = buildSignature(params, this.accessKeySecret)

      const formData = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })

      return await response.json()

    } catch (error) {
      console.error('查询发送记录失败:', error)
      return null
    }
  }

  /**
   * 验证配置是否正确
   */
  validateConfig(): { valid: boolean; missing: string[] } {
    const required = [
      { key: 'accessKeyId', name: 'Access Key ID' },
      { key: 'accessKeySecret', name: 'Access Key Secret' },
      { key: 'signName', name: '短信签名' },
      { key: 'templateCode', name: '模板代码' }
    ]

    const missing: string[] = []

    for (const item of required) {
      if (!this[item.key as keyof this] || (this[item.key as keyof this] as string).trim() === '') {
        missing.push(item.name)
      }
    }

    return {
      valid: missing.length === 0,
      missing
    }
  }
}

// 创建单例实例
export const aliCloudSms = new AliCloudSmsService() 