# 🔐 第三方登录配置指南

本指南将帮助您配置AI图片生成器的第三方登录功能，包括微信登录和支付宝登录。

## 📋 功能概览

✅ **已完成的功能**：
- 🏗️ **OAuth架构**: 完整的OAuth2.0认证流程
- 💬 **微信登录**: 支持网站应用扫码登录
- 💰 **支付宝登录**: 支持支付宝账号登录
- 🗄️ **数据库支持**: 完整的OAuth账户绑定表结构
- 🔒 **安全机制**: CSRF防护、状态验证、令牌管理
- 🔗 **账户绑定**: 支持一个用户绑定多个第三方账户
- 📱 **移动端友好**: 响应式设计，支持移动端登录

---

## 🎯 第一步：执行数据库扩展

### 1.1 在Supabase中执行OAuth扩展

1. **登录Supabase Dashboard**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择您的项目：`hprmigrnyzucmxyhdahd`

2. **执行数据库扩展脚本**
   - 点击左侧菜单 "SQL Editor"
   - 点击 "New query"
   - 复制并执行 `supabase_oauth_extension.sql` 文件内容

3. **验证表创建**
   ```sql
   -- 验证表是否创建成功
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_oauth_accounts', 'oauth_states', 'user_login_history');
   ```

---

## 💬 第二步：配置微信登录

### 2.1 注册微信开放平台账号

1. **访问微信开放平台**
   - 前往 [https://open.weixin.qq.com](https://open.weixin.qq.com)
   - 注册开发者账号并完成认证

2. **创建网站应用**
   - 登录开放平台管理中心
   - 选择 "管理中心" → "网站应用" → "创建网站应用"
   - 填写应用信息：
     - **应用名称**: AI图片生成器
     - **应用简介**: 基于AI的图片生成服务
     - **应用官网**: https://your-domain.com
     - **授权回调域**: your-domain.com（不含http://）

### 2.2 获取微信应用配置

应用审核通过后，在管理中心获取：
- **AppID**: `wx1234567890abcdef`
- **AppSecret**: `your-wechat-app-secret`

### 2.3 配置环境变量

在 `.env.local` 中添加：
```bash
# 微信登录配置
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your-wechat-app-secret
```

### 2.4 设置回调域名

在微信开放平台中设置授权回调域名：
- **生产环境**: `your-domain.com`
- **开发环境**: `localhost:3000`（仅供开发测试）

---

## 💰 第三步：配置支付宝登录

### 3.1 注册支付宝开放平台账号

1. **访问支付宝开放平台**
   - 前往 [https://open.alipay.com](https://open.alipay.com)
   - 注册开发者账号并完成企业认证

2. **创建网页&移动应用**
   - 登录开放平台控制台
   - 选择 "开发者中心" → "我的应用" → "创建应用"
   - 选择应用类型："网页&移动应用"
   - 填写应用信息并上传应用图标

### 3.2 配置应用功能

1. **添加功能**
   - 在应用详情页，添加 "获取会员信息" 功能
   - 填写应用场景和用途说明
   - 等待支付宝审核通过

2. **配置密钥**
   - 生成RSA2(SHA256)密钥对
   - 上传应用公钥到支付宝平台
   - 下载支付宝公钥

### 3.3 生成RSA密钥对

使用支付宝提供的工具生成密钥：
```bash
# 使用支付宝密钥生成工具
# 下载地址：https://docs.open.alipay.com/291/105971

# 或使用OpenSSL生成
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

### 3.4 配置环境变量

在 `.env.local` 中添加：
```bash
# 支付宝登录配置
ALIPAY_APP_ID=20211234567890
ALIPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
-----END PRIVATE KEY-----"
ALIPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----"
```

---

## 🔧 第四步：配置回调域名

### 4.1 生产环境配置

在 `.env.production` 中设置：
```bash
NEXTAUTH_URL=https://your-domain.com
OAUTH_CALLBACK_DOMAIN=https://your-domain.com
```

### 4.2 开发环境配置

在 `.env.local` 中设置：
```bash
NEXTAUTH_URL=http://localhost:3000
OAUTH_CALLBACK_DOMAIN=http://localhost:3000
```

### 4.3 回调URL说明

系统会自动生成以下回调URL：
- **微信回调**: `https://your-domain.com/api/auth/oauth/wechat/callback`
- **支付宝回调**: `https://your-domain.com/api/auth/oauth/alipay/callback`

---

## 🧪 第五步：测试第三方登录

### 5.1 启动应用

```bash
npm run build
npm start
```

### 5.2 测试登录流程

1. **访问登录页面**
   - 打开 `http://localhost:3000/login`
   - 查看微信和支付宝登录按钮

2. **测试微信登录**
   - 点击"微信登录"按钮
   - 应该跳转到微信授权页面
   - 扫码授权后跳转回应用

3. **测试支付宝登录**
   - 点击"支付宝登录"按钮
   - 应该跳转到支付宝授权页面
   - 登录授权后跳转回应用

### 5.3 检查数据库记录

登录成功后，检查数据库表：
```sql
-- 查看OAuth账户绑定记录
SELECT * FROM user_oauth_accounts;

-- 查看登录历史
SELECT * FROM user_login_history 
WHERE login_method IN ('wechat', 'alipay');
```

---

## 🔍 第六步：故障排除

### 6.1 常见问题

**问题1**: 微信授权后提示"redirect_uri参数错误"
- **解决**: 检查微信开放平台的授权回调域名配置
- **确认**: 域名不能包含http://或https://前缀

**问题2**: 支付宝登录提示"应用未配置对应的功能"
- **解决**: 确认支付宝应用已添加"获取会员信息"功能
- **确认**: 功能审核状态为"已生效"

**问题3**: 回调时提示"无效的授权状态"
- **解决**: 检查state参数是否正确传递
- **确认**: OAuth状态记录未过期（10分钟有效期）

### 6.2 调试模式

开启详细日志：
```bash
# 在.env.local中添加
DEBUG=oauth:*
NODE_ENV=development
```

### 6.3 API测试

测试OAuth启动端点：
```bash
# 测试微信登录启动
curl "http://localhost:3000/api/auth/oauth/wechat"

# 测试支付宝登录启动
curl "http://localhost:3000/api/auth/oauth/alipay"
```

---

## 📊 第七步：监控和统计

### 7.1 登录统计查询

```sql
-- 各登录方式统计（最近30天）
SELECT * FROM login_method_stats;

-- OAuth绑定统计
SELECT 
    provider,
    COUNT(*) as total_accounts,
    COUNT(DISTINCT user_id) as unique_users
FROM user_oauth_accounts 
GROUP BY provider;
```

### 7.2 用户绑定情况

```sql
-- 查看用户OAuth绑定情况
SELECT * FROM user_oauth_summary LIMIT 10;
```

---

## 🚀 第八步：扩展更多平台

### 8.1 支持的平台类型

当前架构支持扩展：
- ✅ 微信登录
- ✅ 支付宝登录
- 🔄 QQ登录
- 🔄 GitHub登录
- 🔄 Google登录

### 8.2 添加新平台

1. **在config.ts中添加配置**
2. **在oauthService.ts中实现API调用**
3. **在OAuth路由中添加支持**
4. **更新前端登录按钮**

---

## ✅ 配置完成检查清单

- [ ] 数据库扩展表已创建
- [ ] 微信开放平台应用已配置
- [ ] 支付宝开放平台应用已配置
- [ ] 环境变量已正确设置
- [ ] 回调域名已配置
- [ ] 测试登录流程正常
- [ ] 数据库记录正确保存

---

## 📞 获取帮助

如果在配置过程中遇到问题：

1. **查看系统日志**：检查应用控制台输出
2. **检查数据库**：确认OAuth相关表结构正确
3. **验证配置**：使用生产环境配置验证API
4. **查看文档**：参考微信/支付宝官方文档

**配置验证API**：
```bash
curl "http://localhost:3000/api/test/production-config"
```

---

**🎉 恭喜！您已成功配置第三方登录功能！**

用户现在可以使用微信、支付宝账号快速登录您的AI图片生成器，享受无缝的用户体验。 