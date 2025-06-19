import { randomBytes, createSign, createVerify } from 'crypto';

// 订单信息类型
export interface AlipayOrderInfo {
  orderId: string;
  amount: string;
  subject: string;
  description?: string;
  userId?: string;
  productType: 'package' | 'subscription';
  productId: string;
}

// 点数包配置
const pointPackages = {
  '30': { points: 30, price: '9.00', name: '基础点数包' },
  '100': { points: 100, price: '27.00', name: '标准点数包' },
  '300': { points: 300, price: '66.00', name: '高级点数包' }
};

// 订阅套餐配置
const subscriptionPlans = {
  'pro-monthly': { price: '29.00', name: '专业版-月付' },
  'pro-yearly': { price: '290.00', name: '专业版-年付' },
  'ultimate-monthly': { price: '59.00', name: '全能版-月付' },
  'ultimate-yearly': { price: '590.00', name: '全能版-年付' }
};

// 生成订单号
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `ALI${timestamp}${random}`;
}

// 根据参数创建订单信息
export function createOrderInfo(params: {
  package?: string;
  plan?: string;
  cycle?: string;
  userId?: string;
}): AlipayOrderInfo {
  const orderId = generateOrderId();

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

// 生成支付宝签名
function generateSign(params: Record<string, string>, privateKey: string): string {
  // 排序参数
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
  try {
    const sign = createSign('RSA-SHA256');
    sign.update(sortedParams);
    return sign.sign(privateKey, 'base64');
  } catch (error) {
    console.error('生成签名失败:', error);
    throw new Error('签名生成失败');
  }
}

// 创建支付宝支付链接
export async function createAlipayPayment(orderInfo: AlipayOrderInfo): Promise<string> {
  try {
    const appId = process.env.ALIPAY_APP_ID;
    const privateKey = process.env.ALIPAY_PRIVATE_KEY;
    const gateway = process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do';
    
    if (!appId || !privateKey) {
      throw new Error('支付宝配置缺失');
    }

    const bizContent = {
      out_trade_no: orderInfo.orderId,
      total_amount: orderInfo.amount,
      subject: orderInfo.subject,
      body: orderInfo.description,
      product_code: 'FAST_INSTANT_TRADE_PAY',
      timeout_express: '30m',
      goods_type: '1', // 虚拟商品
    };

    const params: Record<string, string> = {
      app_id: appId,
      method: 'alipay.trade.page.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      version: '1.0',
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/alipay/notify`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderInfo.orderId}`,
      biz_content: JSON.stringify(bizContent),
    };

    // 生成签名
    const sign = generateSign(params, privateKey);
    const signedParams: Record<string, string> = { ...params, sign };

    // 生成查询字符串
    const queryString = Object.keys(signedParams)
      .map(key => `${key}=${encodeURIComponent(signedParams[key])}`)
      .join('&');

    // 返回完整的支付链接
    return `${gateway}?${queryString}`;
  } catch (error) {
    console.error('创建支付宝支付链接失败:', error);
    throw new Error('创建支付链接失败');
  }
}

// 验证支付宝回调签名
export function verifyAlipayCallback(params: Record<string, string>): boolean {
  try {
    const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;
    if (!alipayPublicKey) {
      console.error('支付宝公钥未配置');
      return false;
    }

    const { sign, sign_type, ...otherParams } = params;
    
    if (!sign || sign_type !== 'RSA2') {
      return false;
    }

    // 排序参数
    const sortedKeys = Object.keys(otherParams).sort();
    const sortedParams = sortedKeys.map(key => `${key}=${otherParams[key]}`).join('&');

    // 验证签名
    const verify = createVerify('RSA-SHA256');
    verify.update(sortedParams);
    return verify.verify(alipayPublicKey, sign, 'base64');
  } catch (error) {
    console.error('验证支付宝回调签名失败:', error);
    return false;
  }
}

// 处理支付宝回调
export async function handleAlipayCallback(params: Record<string, string>) {
  // 验证签名
  if (!verifyAlipayCallback(params)) {
    throw new Error('签名验证失败');
  }

  const {
    out_trade_no: orderId,
    trade_no: tradeNo,
    trade_status: tradeStatus,
    total_amount: amount,
    gmt_payment: paymentTime,
    buyer_id: buyerId,
    buyer_logon_id: buyerAccount
  } = params;

  // 只处理支付成功的订单
  if (tradeStatus !== 'TRADE_SUCCESS' && tradeStatus !== 'TRADE_FINISHED') {
    console.log(`订单 ${orderId} 状态为 ${tradeStatus}，暂不处理`);
    return { success: false, message: '支付未完成' };
  }

  // TODO: 这里应该连接数据库处理订单
  // 1. 查找订单
  // 2. 验证金额
  // 3. 更新订单状态
  // 4. 给用户添加点数或开通会员

  console.log('支付宝支付成功:', {
    orderId,
    tradeNo,
    amount,
    paymentTime,
    buyerId,
    buyerAccount
  });

  return {
    success: true,
    message: '支付成功',
    data: {
      orderId,
      tradeNo,
      amount,
      paymentTime
    }
  };
} 