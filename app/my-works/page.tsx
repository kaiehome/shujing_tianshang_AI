"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import MyWorksPage from '../components/MyWorksPage'
import { ImageData } from '../lib/types'

export default function MyWorksRoute() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  // 处理图像编辑
  const handleImageEdit = (image: ImageData) => {
    // 跳转到主页并传递图像数据用于再次编辑
    const editParams = new URLSearchParams({
      editMode: 'true',
      prompt: image.prompt || '',
      style: image.style || '',
      // 可以添加更多参数
    })
    
    router.push(`/?${editParams.toString()}`)
  }

  // 认证检查
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // 未登录，重定向到登录页
      router.push('/login?redirect=' + encodeURIComponent('/my-works'))
    }
  }, [loading, isAuthenticated, router])

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">正在验证身份...</p>
        </div>
      </div>
    )
  }

  // 未认证状态
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">需要登录</h1>
          <p className="text-gray-400 mb-6">请先登录以查看您的作品</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            前往登录
          </button>
        </div>
      </div>
    )
  }

  // 已认证，显示我的作品页面
  return (
    <div className="min-h-screen bg-black">
      <MyWorksPage 
        userId={user!.id}
        userName={user?.profile?.nickname || user?.name}
        onImageEdit={handleImageEdit}
      />
    </div>
  )
} 