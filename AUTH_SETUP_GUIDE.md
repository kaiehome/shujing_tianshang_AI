# 认证系统配置指南

## 环境变量配置

请在项目根目录创建 `.env.local` 文件，并配置以下环境变量：

```bash
# 数据库配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT密钥
JWT_SECRET=your_jwt_secret_here

# 应用URL
NEXTAUTH_URL=http://localhost:3000

# 阿里云短信服务配置
ALICLOUD_ACCESS_KEY_ID=your_alicloud_access_key_id
ALICLOUD_ACCESS_KEY_SECRET=your_alicloud_access_key_secret
ALICLOUD_SMS_SIGN_NAME=your_sms_sign_name
ALICLOUD_SMS_TEMPLATE_CODE=your_sms_template_code

# 微信开放平台配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 支付宝开放平台配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
ALIPAY_PUBLIC_KEY=your_alipay_public_key

# AI图像生成服务配置
HUGGINGFACE_API_TOKEN=your_huggingface_token
HUGGINGFACE_SPACE_URL=your_space_url

# 其他配置
NODE_ENV=development
```

## 数据库设置

1. 在Supabase中执行 `supabase_auth_schema.sql` 文件来创建认证相关的数据库表
2. 确保RLS策略已正确设置
3. 确保所有必要的索引已创建

## 第三方服务配置

### 阿里云短信服务

1. 登录阿里云控制台
2. 开通短信服务
3. 创建签名和模板
4. 获取AccessKey和AccessSecret
5. 配置相应的环境变量

### 微信开放平台

1. 注册微信开放平台开发者账号
2. 创建网站应用
3. 获取AppID和AppSecret
4. 配置授权回调域名：`your_domain.com/api/auth/wechat/callback`
5. 配置相应的环境变量

### 支付宝开放平台

1. 注册支付宝开放平台开发者账号
2. 创建应用
3. 配置应用信息和授权回调地址：`your_domain.com/api/auth/alipay/callback`
4. 生成应用私钥和公钥
5. 配置相应的环境变量

## 功能特性

### ✅ 已实现功能

- 手机验证码登录/注册
- 微信授权登录
- 支付宝授权登录
- JWT令牌认证
- 用户资料管理
- 会话管理
- 路由保护中间件
- 安全的Cookie管理
- 短信发送频率限制
- 数据库安全策略(RLS)

### 🔧 技术架构

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **认证**: JWT + HTTP-only Cookies
- **短信服务**: 阿里云短信
- **第三方登录**: 微信、支付宝
- **状态管理**: React Hooks

### 📁 项目结构

```
app/
├── lib/auth/           # 认证相关核心逻辑
│   ├── types.ts        # 类型定义
│   ├── config.ts       # 配置文件
│   ├── utils.ts        # 工具函数
│   ├── smsService.ts   # 短信服务
│   ├── oauthService.ts # OAuth服务
│   └── authService.ts  # 认证服务
├── api/auth/          # 认证API端点
│   ├── sms/send/      # 发送验证码
│   ├── login/phone/   # 手机登录
│   ├── wechat/        # 微信登录
│   ├── alipay/        # 支付宝登录
│   ├── logout/        # 退出登录
│   ├── me/           # 获取用户信息
│   └── profile/      # 更新用户资料
├── hooks/
│   └── useAuth.ts     # 认证Hook
├── components/
│   ├── LoginForm.tsx  # 登录表单
│   └── UserProfile.tsx # 用户资料组件
└── login/
    └── page.tsx       # 登录页面
```

## 使用示例

### 在组件中使用认证

```tsx
import { useAuth } from '../hooks/useAuth'

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>请先登录</div>
  }
  
  return (
    <div>
      <h1>欢迎, {user?.name}</h1>
      <button onClick={logout}>退出登录</button>
    </div>
  )
}
```

### API路由保护

```tsx
import { authService } from '../../lib/auth/authService'

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  
  if (!authToken) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }
  
  const user = await authService.getCurrentUser(authToken)
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 401 })
  }
  
  // 处理受保护的逻辑
}
```

## 安全考虑

1. **JWT密钥**: 使用强随机密钥
2. **Cookie安全**: HTTP-only, Secure, SameSite
3. **HTTPS**: 生产环境必须使用HTTPS
4. **短信限流**: 防止短信轰炸
5. **输入验证**: 所有用户输入都进行验证
6. **RLS策略**: 数据库行级安全
7. **密码存储**: 使用PBKDF2哈希（如果需要密码功能）

## 部署注意事项

1. 确保所有环境变量在生产环境中正确配置
2. 配置正确的域名和回调URL
3. 启用HTTPS
4. 配置CDN和缓存策略
5. 监控和日志记录
6. 定期清理过期的会话和验证码

## 故障排除

### 常见问题

1. **验证码发送失败**
   - 检查阿里云短信配置
   - 确认签名和模板已审核通过
   - 查看短信发送日志

2. **第三方登录失败**
   - 检查AppID和AppSecret
   - 确认回调域名配置正确
   - 检查授权作用域

3. **JWT验证失败**
   - 检查JWT_SECRET配置
   - 确认token未过期
   - 检查Cookie设置

4. **数据库连接失败**
   - 检查Supabase配置
   - 确认网络连接
   - 查看RLS策略

## 性能优化

1. **数据库索引**: 已创建必要索引
2. **连接池**: 使用Supabase连接池
3. **缓存策略**: 可考虑添加Redis缓存
4. **CDN**: 静态资源使用CDN
5. **代码分割**: Next.js自动代码分割
6. **SSR优化**: 合理使用SSR和CSR

## 后续扩展

1. **邮箱登录**: 添加邮箱验证码登录
2. **多因子认证**: 支持TOTP/SMS二次验证
3. **社交登录**: 添加更多第三方登录方式
4. **权限系统**: 实现角色和权限管理
5. **审计日志**: 记录用户操作日志
6. **账户安全**: 异常登录检测和通知 