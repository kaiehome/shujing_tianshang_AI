# 支付宝支付配置说明

## 1. 申请支付宝开放平台账号

1. 访问 [支付宝开放平台](https://open.alipay.com/)
2. 注册并完成企业认证
3. 创建应用，选择"网页&移动应用"

## 2. 获取必要的配置信息

### 应用ID (ALIPAY_APP_ID)
- 在应用详情页面可以看到应用ID
- 格式：20位数字，如：2021001234567890

### 应用私钥 (ALIPAY_PRIVATE_KEY)
1. 下载支付宝密钥生成工具
2. 生成RSA2密钥对
3. 将应用公钥上传到支付宝开放平台
4. 保存应用私钥用于环境变量配置

### 支付宝公钥 (ALIPAY_PUBLIC_KEY)
- 在支付宝开放平台的应用详情页面
- 在"开发设置" -> "接口加签方式"中获取支付宝公钥

## 3. 环境变量配置

在 `.env.local` 文件中添加以下配置：

```bash
# 支付宝支付配置
ALIPAY_APP_ID=2021001234567890
ALIPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_content_here
-----END PRIVATE KEY-----"
ALIPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
alipay_public_key_content_here
-----END PUBLIC KEY-----"
ALIPAY_GATEWAY=https://openapi.alipay.com/gateway.do
```

## 4. 配置支付宝应用功能

### 添加功能包
在支付宝开放平台应用管理页面：
1. 点击"添加功能"
2. 搜索并添加"电脑网站支付"功能
3. 等待审核通过

### 配置回调地址
1. 在应用详情页面找到"接口内容加密方式"
2. 设置异步通知地址：`https://yourdomain.com/api/payment/alipay/notify`
3. 设置同步跳转地址：`https://yourdomain.com/payment/success`

## 5. 测试环境配置

### 沙箱环境
支付宝提供沙箱环境用于测试：
1. 访问 [支付宝开放平台沙箱](https://openhome.alipay.com/platform/appDaily.htm)
2. 获取沙箱版本的配置信息
3. 使用沙箱网关：`https://openapi.alipaydev.com/gateway.do`

### 测试账号
沙箱环境提供测试买家账号：
- 买家账号：jfjbwb4477@sandbox.com
- 登录密码：111111
- 支付密码：111111

## 6. 安全注意事项

1. **私钥安全**：应用私钥绝对不能泄露，建议使用环境变量存储
2. **签名验证**：所有回调都必须验证支付宝签名
3. **金额验证**：回调时必须验证订单金额是否正确
4. **订单状态**：只处理 `TRADE_SUCCESS` 和 `TRADE_FINISHED` 状态的订单
5. **幂等性**：同一订单的回调可能收到多次，需要保证处理的幂等性

## 7. 常见问题

### Q: 签名验证失败？
A: 检查以下几点：
- 应用私钥格式是否正确
- 支付宝公钥是否是最新的
- 参数编码是否为UTF-8
- 签名算法是否为RSA2

### Q: 回调地址无法访问？
A: 确保：
- 回调地址可以从外网访问
- 服务器防火墙已开放相应端口
- 使用HTTPS协议（生产环境必须）

### Q: 订单状态异常？
A: 可能原因：
- 回调处理失败导致支付宝重复通知
- 订单金额与实际支付金额不符
- 订单处理逻辑存在问题

## 8. 生产环境上线

1. **实名认证**：完成支付宝开放平台的实名认证
2. **应用上线**：将应用从沙箱环境切换到正式环境
3. **域名配置**：配置正式域名的回调地址
4. **监控告警**：设置支付监控和异常告警
5. **备案要求**：确保域名已完成ICP备案

## 9. 相关文档

- [支付宝开放平台文档](https://opendocs.alipay.com/)
- [电脑网站支付API](https://opendocs.alipay.com/open/270/105898)
- [支付宝SDK使用说明](https://github.com/alipay/alipay-sdk-nodejs-all) 