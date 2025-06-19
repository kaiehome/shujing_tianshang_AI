'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 只有当URL包含认证参数时才处理回调
    const code = searchParams?.get('code');
    const error = searchParams?.get('error');
    
    if (code || error) {
      // 简单的认证回调处理
      if (error) {
        console.error('OAuth认证失败:', error);
        router.push('/login?error=oauth_failed');
      } else {
        console.log('OAuth认证成功，跳转首页');
        router.push('/');
      }
    } else {
      // 这是普通页面访问或刷新，不进行重定向
      console.log('认证回调页面：无认证参数，保持当前页面');
    }
  }, [router, searchParams]);

  return <div className="min-h-screen flex items-center justify-center">正在验证登录信息...</div>;
}
