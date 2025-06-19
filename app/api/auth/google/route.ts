import { NextResponse } from 'next/server';

export async function POST() {
  // 这里实现实际的Google OAuth认证逻辑
  // 返回认证成功后的用户信息
  return NextResponse.json({ 
    success: true,
    user: {
      id: '123',
      name: 'Google User',
      email: 'user@example.com'
    }
  });
}