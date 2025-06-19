import { randomBytes, createHash } from 'crypto';

// 微信支付订单信息类型
export interface WechatOrderInfo {
  orderId: string;
  amount: string; // 单位：分
  subject: string;
  description?: string;
  userId?: string;
  productType: 'package' | 'subscription';
  productId: string;
}

// 点数包配置
const pointPackages = {
  '30': { points: 30, price: '900', name: '基础点数包' }, // 9元 = 900分
  '100': { points: 100, price: '2700', name: '标准点数包' }, // 27元 = 2700分
  '300': { points: 300, price: '6600', name: '高级点数包' } // 66元 = 6600分
};

// 订阅套餐配置
const subscriptionPlans = {
  'pro-monthly': { price: '2900', name: '专业版-月付' }, // 29元 = 2900分
  'pro-yearly': { price: '29000', name: '专业版-年付' }, // 290元 = 29000分
  'ultimate-monthly': { price: '5900', name: '全能版-月付' }, // 59元 = 5900分
  'ultimate-yearly': { price: '59000', name: '全能版-年付' } // 590元 = 59000分
};

// 生成订单号
export function generateWechatOrderId(): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `WX${timestamp}${random}`;
}

// 根据参数创建订单信息
export function createWechatOrderInfo(params: {
  package?: string;
  plan?: string;
  cycle?: string;
  userId?: string;
}): WechatOrderInfo {
  const orderId = generateWechatOrderId();

  if (params.package) {
    // 点数包订单
    const pkg = pointPackages[params.package as keyof typeof pointPackages];
    if (!pkg) {
      throw new Error(`无效的点数包: ${params.package}`);
    }

    return {
      orderId,
      amount: pkg.price,
      subject: `画芽空间 - ${pkg.name}`,
      description: `购买 ${pkg.points} 点数`,
      userId: params.userId,
      productType: 'package',
      productId: params.package
    };
  } else if (params.plan && params.cycle) {
    // 订阅套餐订单
    const planKey = `${params.plan}-${params.cycle}` as keyof typeof subscriptionPlans;
    const plan = subscriptionPlans[planKey];
    if (!plan) {
      throw new Error(`无效的订阅套餐: ${planKey}`);
    }

    return {
      orderId,
      amount: plan.price,
      subject: `画芽空间 - ${plan.name}`,
      description: `订阅 ${plan.name}`,
      userId: params.userId,
      productType: 'subscription',
      productId: planKey
    };
  } else {
    throw new Error('缺少必要的订单参数');
  }
}

// 生成微信支付签名
function generateWechatSign(params: Record<string, string>, apiKey: string): string {
  // 排序参数
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys
    .filter(key => params[key] !== '' && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // 添加key
  const stringSignTemp = `${sortedParams}&key=${apiKey}`;
  
  // MD5签名
  return createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}

// 创建微信支付统一下单
export async function createWechatPayment(orderInfo: WechatOrderInfo): Promise<{
  success: boolean;
  qrCodeUrl?: string;
  orderId?: string;
  prepayId?: string;
}> {
  try {
    const appId = process.env.WECHAT_APP_ID;
    const mchId = process.env.WECHAT_MCH_ID;
    const apiKey = process.env.WECHAT_API_KEY;
    
    if (!appId || !mchId || !apiKey) {
      throw new Error('微信支付配置缺失');
    }

    const params: Record<string, string> = {
      appid: appId,
      mch_id: mchId,
      nonce_str: randomBytes(16).toString('hex'),
      body: orderInfo.subject,
      detail: orderInfo.description || '',
      out_trade_no: orderInfo.orderId,
      total_fee: orderInfo.amount,
      spbill_create_ip: '127.0.0.1', // 实际应该获取真实IP
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/wechat/notify`,
      trade_type: 'NATIVE', // 二维码支付
    };

    // 生成签名
    const sign = generateWechatSign(params, apiKey);
    const signedParams: Record<string, string> = { ...params, sign };

    // 生成XML请求体
    const xmlBody = Object.keys(signedParams)
      .map(key => `<${key}>${signedParams[key]}</${key}>`)
      .join('');
    const xml = `<xml>${xmlBody}</xml>`;

    // 调用微信统一下单API
    const response = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xml,
    });

    const responseText = await response.text();
    
    // 解析XML响应
    const result = parseWechatXmlResponse(responseText);
    
    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      return {
        success: true,
        qrCodeUrl: result.code_url,
        orderId: orderInfo.orderId,
        prepayId: result.prepay_id
      };
    } else {
      throw new Error(`微信支付创建失败: ${result.return_msg || result.err_code_des}`);
    }
  } catch (error) {
    console.error('创建微信支付失败:', error);
    throw new Error('创建支付失败');
  }
}

// 解析微信XML响应
function parseWechatXmlResponse(xml: string): Record<string, string> {
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

// 验证微信支付回调签名
export function verifyWechatCallback(params: Record<string, string>): boolean {
  try {
    const apiKey = process.env.WECHAT_API_KEY;
    if (!apiKey) {
      console.error('微信支付API密钥未配置');
      return false;
    }

    const { sign, ...otherParams } = params;
    const calculatedSign = generateWechatSign(otherParams, apiKey);
    
    return sign === calculatedSign;
  } catch (error) {
    console.error('验证微信支付回调签名失败:', error);
    return false;
  }
}

// 处理微信支付回调
export async function handleWechatCallback(params: Record<string, string>) {
  // 验证签名
  if (!verifyWechatCallback(params)) {
    throw new Error('签名验证失败');
  }

  const {
    return_code: returnCode,
    result_code: resultCode,
    out_trade_no: orderId,
    transaction_id: transactionId,
    total_fee: amount,
    time_end: paymentTime,
    openid
  } = params;

  // 只处理支付成功的订单
  if (returnCode !== 'SUCCESS' || resultCode !== 'SUCCESS') {
    console.log(`订单 ${orderId} 支付失败:`, params);
    return { success: false, message: '支付失败' };
  }

  // TODO: 这里应该连接数据库处理订单
  // 1. 查找订单
  // 2. 验证金额
  // 3. 更新订单状态
  // 4. 给用户添加点数或开通会员

  console.log('微信支付成功:', {
    orderId,
    transactionId,
    amount,
    paymentTime,
    openid
  });

  return {
    success: true,
    message: '支付成功',
    data: {
      orderId,
      transactionId,
      amount,
      paymentTime
    }
  };
}

// 查询微信支付订单状态
export async function queryWechatOrder(orderId: string) {
  try {
    const appId = process.env.WECHAT_APP_ID;
    const mchId = process.env.WECHAT_MCH_ID;
    const apiKey = process.env.WECHAT_API_KEY;
    
    if (!appId || !mchId || !apiKey) {
      throw new Error('微信支付配置缺失');
    }

    const params: Record<string, string> = {
      appid: appId,
      mch_id: mchId,
      out_trade_no: orderId,
      nonce_str: randomBytes(16).toString('hex'),
    };

    const sign = generateWechatSign(params, apiKey);
    const signedParams: Record<string, string> = { ...params, sign };

    // 生成XML请求体
    const xmlBody = Object.keys(signedParams)
      .map(key => `<${key}>${signedParams[key]}</${key}>`)
      .join('');
    const xml = `<xml>${xmlBody}</xml>`;

    // 调用微信查询订单API
    const response = await fetch('https://api.mch.weixin.qq.com/pay/orderquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xml,
    });

    const responseText = await response.text();
    return parseWechatXmlResponse(responseText);
  } catch (error) {
    console.error('查询微信订单失败:', error);
    throw new Error('查询订单失败');
  }
} 