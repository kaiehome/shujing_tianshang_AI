import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// 需要认证的路径
const protectedPaths = [
  '/my-works',
  '/zh/my-works',
  '/history',
  '/zh/history',
  '/payment',
  '/zh/payment',
  '/profile',
  '/zh/profile'
]

// 认证相关路径（已登录用户不应访问）
const authPaths = [
  '/login',
  '/zh/login',
  '/register',
  '/zh/register'
]

// 公开路径（无需认证）
const publicPaths = [
  '/',
  '/zh',
  '/features',
  '/zh/features',
  '/pricing',
  '/zh/pricing',
  '/help',
  '/zh/help',
  '/contact',
  '/zh/contact',
  '/terms',
  '/zh/terms',
  '/usage-terms',
  '/zh/usage-terms',
  '/privacy',
  '/zh/privacy',
  '/faq',
  '/zh/faq'
]

// API路径（有自己的认证逻辑）
const apiPaths = [
  '/api'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 检查API路径，直接跳过处理
  if (apiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // 检查静态文件路径，直接跳过
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }
  
  // 语言检测和重定向逻辑 - 仅在首次访问且无明确语言偏好时
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isChinesePreferred = acceptLanguage.includes('zh');
  const referer = request.headers.get('referer');
  
  // 检查是否是来自站内的导航（用户主动选择语言）
  const isInternalNavigation = referer && new URL(referer).hostname === request.nextUrl.hostname;
  
  // 只有在访问根路径、浏览器偏好中文、且不是站内导航时才重定向
  if (pathname === '/' && isChinesePreferred && !isInternalNavigation) {
    return NextResponse.redirect(new URL('/zh', request.url));
  }
  
  // 获取认证token
  const authToken = request.cookies.get('auth_token')?.value
  let isAuthenticated = false
  
  // 验证token
  if (authToken) {
    try {
      jwt.verify(authToken, process.env.JWT_SECRET || 'default-secret')
      isAuthenticated = true
    } catch (error) {
      // Token无效，清除cookie
      const response = NextResponse.next()
      response.cookies.delete('auth_token')
      response.cookies.delete('refresh_token')
    }
  }
  
  // 检查是否为保护路径
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // 检查是否为认证路径
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // 如果是保护路径但用户未认证，重定向到登录页
  if (isProtectedPath && !isAuthenticated) {
    const currentLocale = pathname.startsWith('/zh') ? 'zh' : 'en';
    const loginPath = currentLocale === 'zh' ? '/zh/login' : '/login';
    const loginUrl = new URL(loginPath, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 如果用户已认证但访问认证页面，重定向到首页
  if (isAuthPath && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || 
      (pathname.startsWith('/zh') ? '/zh' : '/')
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
  
  return NextResponse.next()
}

// 配置matcher
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api路径 (通过代码逻辑处理)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 静态文件扩展名
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 