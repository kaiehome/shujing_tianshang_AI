# 🚀 生产环境配置指南

## 📋 配置清单

在部署到生产环境之前，您需要完成以下配置：

- [ ] Supabase数据库设置
- [ ] 阿里云短信服务配置
- [ ] 环境变量设置
- [ ] 功能测试验证

---

## 🗄️ 1. Supabase数据库配置

### 1.1 创建Supabase项目

1. 访问 [Supabase官网](https://supabase.com)
2. 注册账号并登录
3. 点击"New Project"创建新项目
4. 填写项目信息：
   - **Name**: `ai-image-generator`
   - **Organization**: 选择或创建组织
   - **Password**: 设置强密码（记住此密码）
   - **Region**: 选择就近地区（推荐：Singapore）

### 1.2 获取连接信息

项目创建完成后，在项目设置页面获取：

- **Project URL**: `https://xxx.supabase.co`
- **API Keys**:
  - `anon/public key` (用于客户端)
  - `service_role key` (用于服务端，仅在必要时使用)

### 1.3 执行数据库表结构

1. 在Supabase Dashboard中，点击左侧菜单的"SQL Editor"
2. 复制 `supabase_schema.sql` 文件的全部内容
3. 粘贴到SQL编辑器中并执行
4. 确认所有表都创建成功

### 1.4 配置行级安全策略（RLS）

数据库脚本已包含RLS策略，确保用户只能访问自己的数据。

---

## 📱 2. 阿里云短信服务配置

### 2.1 开通短信服务

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com)
2. 搜索"短信服务"并进入控制台
3. 开通短信服务并完成实名认证

### 2.2 创建签名

1. 在短信服务控制台，点击"签名管理" > "添加签名"
2. 填写签名信息：
   - **签名名称**: 您的应用名称，如"AI图片生成器"
   - **签名来源**: 选择合适的类型（如：App应用）
   - **说明**: 简要说明用途
3. 等待审核通过（通常1-2个工作日）

### 2.3 创建模板

1. 点击"模板管理" > "添加模板"
2. 创建验证码模板：
   - **模板类型**: 验证码
   - **模板名称**: 验证码短信
   - **模板内容**: `您的验证码是${code}，5分钟内有效，请勿泄露。`
3. 等待审核通过

### 2.4 创建AccessKey

1. 点击右上角头像 > "AccessKey管理"
2. 建议创建子用户而非使用主账号AccessKey：
   - 进入"RAM控制台"
   - 创建子用户，授予`AliyunDysmsFullAccess`权限
   - 为子用户创建AccessKey

---

## 🔐 3. 环境变量配置

### 3.1 创建环境变量文件

复制 `env.example` 为 `.env.local`（开发环境）或设置生产环境变量：

```bash
cp env.example .env.local
```

### 3.2 填写配置信息

```bash
# 应用基础配置
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Supabase 数据库配置
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 阿里云短信服务配置
ALICLOUD_ACCESS_KEY_ID=LTAI5t...
ALICLOUD_ACCESS_KEY_SECRET=xxx...
ALICLOUD_SMS_SIGN_NAME=AI图片生成器
ALICLOUD_SMS_TEMPLATE_CODE=SMS_123456789

# 其他服务配置（可选）
OPENAI_API_KEY=sk-...
WECHAT_APP_ID=wx...
ALIPAY_APP_ID=2021...
```

### 3.3 重要安全提示

- ⚠️ **JWT_SECRET**: 必须是强随机字符串，可使用以下命令生成：
  ```bash
  openssl rand -base64 32
  ```
- ⚠️ **生产环境**: 确保 `NODE_ENV=production`
- ⚠️ **域名**: `NEXTAUTH_URL` 必须是您的实际域名

---

## 🧪 4. 功能测试验证

### 4.1 启动应用

```bash
npm run build
npm start
```

### 4.2 测试配置

访问配置验证接口：

```bash
curl http://localhost:3000/api/test/production-config
```

或在浏览器中访问：`http://localhost:3000/api/test/production-config`

### 4.3 测试短信发送

```bash
curl -X POST http://localhost:3000/api/test/production-config \
  -H "Content-Type: application/json" \
  -d '{"action": "test_sms", "params": {"phone": "13800138000"}}'
```

### 4.4 测试数据库写入

```bash
curl -X POST http://localhost:3000/api/test/production-config \
  -H "Content-Type: application/json" \
  -d '{"action": "test_db_write"}'
```

---

## 📊 5. 配置检查清单

使用以下清单确保配置完整：

### 5.1 必需配置 ✅

- [ ] `NODE_ENV=production`
- [ ] `NEXTAUTH_URL` 设置为实际域名
- [ ] `JWT_SECRET` 使用强随机字符串
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已配置
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已配置
- [ ] `ALICLOUD_ACCESS_KEY_ID` 已配置
- [ ] `ALICLOUD_ACCESS_KEY_SECRET` 已配置
- [ ] `ALICLOUD_SMS_SIGN_NAME` 已审核通过
- [ ] `ALICLOUD_SMS_TEMPLATE_CODE` 已审核通过

### 5.2 数据库检查 ✅

- [ ] Supabase项目创建成功
- [ ] 数据库表结构已执行
- [ ] RLS策略已启用
- [ ] 连接测试通过

### 5.3 短信服务检查 ✅

- [ ] 阿里云短信服务已开通
- [ ] 短信签名已审核通过
- [ ] 短信模板已审核通过
- [ ] AccessKey权限正确
- [ ] 测试短信发送成功

---

## 🚨 6. 常见问题排查

### 6.1 Supabase连接失败

**问题**: 数据库连接测试失败

**排查步骤**:
1. 检查URL和API Key是否正确
2. 确认Supabase项目状态正常
3. 检查网络连接
4. 验证表结构是否正确创建

### 6.2 短信发送失败

**问题**: 短信发送返回错误

**常见错误及解决方案**:

| 错误代码 | 说明 | 解决方案 |
|---------|------|----------|
| `isv.SMS_SIGN_ILLEGAL` | 短信签名不合法 | 确认签名已审核通过 |
| `isv.SMS_TEMPLATE_ILLEGAL` | 短信模板不合法 | 确认模板已审核通过 |
| `isv.BUSINESS_LIMIT_CONTROL` | 业务限流 | 检查发送频率限制 |
| `isv.AMOUNT_NOT_ENOUGH` | 账户余额不足 | 充值阿里云账户 |

### 6.3 JWT错误

**问题**: JWT相关错误

**解决方案**:
1. 确保JWT_SECRET不是默认值
2. 检查密钥长度（建议32位以上）
3. 重新生成强随机密钥

---

## 🎯 7. 性能优化建议

### 7.1 数据库优化

- 定期清理过期的短信验证码记录
- 为高频查询字段添加索引
- 配置合适的连接池大小

### 7.2 短信服务优化

- 实施频率限制策略
- 缓存验证码以减少重复发送
- 监控短信发送成功率

### 7.3 应用性能

- 启用NextJS的静态生成
- 配置CDN加速静态资源
- 启用gzip压缩

---

## 🔒 8. 安全注意事项

### 8.1 密钥管理

- 使用环境变量存储所有敏感信息
- 定期轮换API密钥
- 不要将密钥提交到代码仓库

### 8.2 网络安全

- 启用HTTPS
- 配置防火墙规则
- 实施速率限制

### 8.3 数据保护

- 启用数据库备份
- 配置RLS安全策略
- 定期安全审计

---

## 📞 9. 技术支持

如果在配置过程中遇到问题，可以：

1. 查看应用日志文件
2. 使用配置验证API排查问题
3. 参考官方文档：
   - [Supabase文档](https://supabase.com/docs)
   - [阿里云短信服务文档](https://help.aliyun.com/product/44282.html)

---

**配置完成后，您的AI图片生成器就可以在生产环境中正常运行了！** 🎉 