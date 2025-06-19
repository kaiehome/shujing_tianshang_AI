# 支付功能快速配置指南

## 🚀 快速开始

### 方法一：使用交互式配置工具（推荐）

```bash
# 运行配置助手
npm run payment:setup
```

该工具将引导您完成所有配置步骤，包括：
- 自动生成JWT密钥
- 验证输入格式
- 生成配置文件
- 提供下一步指引

### 方法二：手动配置

1. **复制环境变量模板**
   ```bash
   cp payment.env.template .env.local
   ```

2. **编辑配置文件**
   ```bash
   nano .env.local
   ```

3. **填入您的配置参数**（参考下方配置表）

## 📋 所需配置参数

### 🏦 微信支付
| 参数 | 获取位置 | 格式要求 | 示例 |
|------|----------|----------|------|
| WECHAT_MCH_ID | 微信支付商户平台 → 商户信息 | 10位数字 | 1234567890 |
| WECHAT_KEY | 商户平台 → API安全 → 设置密钥 | 32位字符串 | abcd1234EFGH5678... |
| WECHAT_CALLBACK_URL | 自动生成 | HTTPS地址 | https://your-domain.com/api/payment/callback/wechat |

### 💰 支付宝
| 参数 | 获取位置 | 格式要求 | 示例 |
|------|----------|----------|------|
| ALIPAY_APP_ID | 支付宝开放平台 → 应用详情 | 16位数字 | 2021001234567890 |
| ALIPAY_PRIVATE_KEY | 密钥生成工具生成 | PEM格式 | -----BEGIN PRIVATE KEY----- |
| ALIPAY_PUBLIC_KEY | 支付宝开放平台获取 | PEM格式 | -----BEGIN PUBLIC KEY----- |
| ALIPAY_CALLBACK_URL | 自动生成 | HTTPS地址 | https://your-domain.com/api/payment/callback/alipay |

## 🔧 验证配置

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 验证配置正确性
```bash
# 验证支付配置
npm run payment:verify

# 验证数据库表
npm run payment:test-tables
```

### 3. 手动验证（备选）
```bash
# 访问配置验证接口
curl http://localhost:3000/api/payment/config/verify

# 访问数据库测试接口
curl http://localhost:3000/api/test/payment-tables
```

## ✅ 配置检查清单

### 基础配置
- [ ] JWT_SECRET 已设置（至少32位）
- [ ] NEXT_PUBLIC_APP_DOMAIN 已设置
- [ ] 域名使用HTTPS协议

### 微信支付（可选）
- [ ] WECHAT_MCH_ID 已设置（10位数字）
- [ ] WECHAT_KEY 已设置（32位字符串）
- [ ] WECHAT_CALLBACK_URL 已设置
- [ ] 微信商户平台已配置回调地址

### 支付宝（可选）
- [ ] ALIPAY_APP_ID 已设置（16位数字）
- [ ] ALIPAY_PRIVATE_KEY 已设置（完整PEM格式）
- [ ] ALIPAY_PUBLIC_KEY 已设置（完整PEM格式）
- [ ] ALIPAY_CALLBACK_URL 已设置
- [ ] 支付宝开放平台已配置回调地址

### 数据库
- [ ] Supabase 配置正确
- [ ] 支付相关表已创建
- [ ] RLS 策略已启用

## 🧪 测试支付流程

### 1. 沙箱环境测试（推荐）

**微信支付沙箱**
```bash
# 在 .env.local 中添加沙箱配置
WECHAT_GATEWAY_URL=https://api.mch.weixin.qq.com/sandboxnew
```

**支付宝沙箱**
```bash
# 在 .env.local 中修改网关地址
ALIPAY_GATEWAY_URL=https://openapi.alipaydev.com/gateway.do
```

### 2. 创建测试订单

1. 登录应用
2. 访问支付页面
3. 选择商品和支付方式
4. 创建测试订单
5. 使用测试账号扫码支付

### 3. 验证回调处理

检查以下功能是否正常：
- [ ] 订单状态更新
- [ ] 点数充值
- [ ] 会员开通
- [ ] 支付记录创建

## 🚨 常见问题

### Q1: 微信支付回调接收不到？
**解决方案：**
1. 确认回调地址可公网访问
2. 检查HTTPS证书有效性
3. 在微信商户平台配置正确的回调地址

### Q2: 支付宝签名验证失败？
**解决方案：**
1. 检查私钥格式是否完整
2. 确认使用的是RSA2算法
3. 验证公钥是否已正确上传

### Q3: 配置验证显示错误？
**解决方案：**
1. 检查环境变量名称拼写
2. 确认所有必需参数已设置
3. 验证参数格式是否正确

### Q4: 数据库表不存在？
**解决方案：**
1. 在Supabase控制台执行SQL脚本
2. 检查数据库连接配置
3. 确认RLS策略已启用

## 📞 获取帮助

1. **查看详细配置指南**：`PAYMENT_SETUP_GUIDE.md`
2. **检查日志文件**：开发者工具 → Console
3. **联系技术支持**：提供配置验证结果

## 🎯 下一步

配置完成后，您可以：

1. **集成到主应用**：在需要的页面引入支付组件
2. **自定义样式**：修改支付页面UI
3. **添加更多功能**：优惠券、退款等
4. **监控支付数据**：配置分析和报警

---

**�� 恭喜！您的支付系统已配置完成！**