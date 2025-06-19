'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

interface UserProfileProps {
  isEditing?: boolean
  onEditToggle?: () => void
}

export default function UserProfile({ isEditing: propIsEditing, onEditToggle }: UserProfileProps) {
  const { user, updateProfile, refreshUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(propIsEditing || false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nickname: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    birthday: '',
    location: '',
    bio: '',
    preferences: {
      language: 'zh-CN' as 'zh-CN' | 'en-US',
      theme: 'auto' as 'light' | 'dark' | 'auto',
      notifications: {
        email: false,
        sms: true,
        push: true
      },
      privacy: {
        profile_public: false,
        works_public: true
      }
    }
  })

  // 初始化表单数据
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        nickname: user.profile.nickname || user.name || '',
        gender: user.profile.gender || 'unknown',
        birthday: user.profile.birthday || '',
        location: user.profile.location || '',
        bio: user.profile.bio || '',
        preferences: {
          ...formData.preferences,
          ...user.profile.preferences
        }
      })
    }
  }, [user])

  // 处理编辑状态切换
  const handleEditToggle = () => {
    const newEditingState = !isEditing
    setIsEditing(newEditingState)
    if (onEditToggle) {
      onEditToggle()
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile({
        nickname: formData.nickname,
        gender: formData.gender,
        birthday: formData.birthday || null,
        location: formData.location,
        bio: formData.bio,
        preferences: formData.preferences
      })

      if (result.success) {
        toast.success('资料更新成功')
        setIsEditing(false)
        await refreshUser()
      } else {
        toast.error(result.error || '更新失败')
      }
    } catch (error) {
      toast.error('更新资料失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 处理注销
  const handleLogout = async () => {
    if (confirm('确定要退出登录吗？')) {
      await logout()
      toast.success('已退出登录')
    }
  }

  if (!user) {
    return (
      <div className="bg-zinc-800/50 rounded-xl p-6 text-center">
        <p className="text-gray-400">请先登录查看个人资料</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-600/30 shadow-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">个人资料</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditToggle}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isEditing ? '取消编辑' : '编辑资料'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {isEditing ? (
        /* 编辑模式 */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户头像和基本信息 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">手机号</p>
              <p className="text-white">{user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : '未设置'}</p>
              <p className="text-xs text-gray-500 mt-1">登录方式: {user.provider === 'phone' ? '手机验证码' : user.provider === 'wechat' ? '微信' : '支付宝'}</p>
            </div>
          </div>

          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">昵称</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="请输入昵称"
              className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
          </div>

          {/* 性别 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">性别</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="unknown">不便透露</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">生日</label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 地区 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">地区</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="请输入所在地区"
              className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="介绍一下自己吧..."
              rows={3}
              className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={200}
            />
          </div>

          {/* 偏好设置 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">偏好设置</h3>
            
            {/* 主题 */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">主题</label>
              <select
                value={formData.preferences.theme}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, theme: e.target.value as any }
                })}
                className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">跟随系统</option>
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </div>

            {/* 隐私设置 */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">隐私设置</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.preferences.privacy.profile_public}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      privacy: { ...formData.preferences.privacy, profile_public: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">公开个人资料</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.preferences.privacy.works_public}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      privacy: { ...formData.preferences.privacy, works_public: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">公开我的作品</span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                '保存更改'
              )}
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        /* 查看模式 */
        <div className="space-y-4">
          {/* 用户头像和基本信息 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.profile?.nickname || user.name}</h3>
              <p className="text-sm text-gray-400">{user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : '未设置手机号'}</p>
              <p className="text-xs text-gray-500">登录方式: {user.provider === 'phone' ? '手机验证码' : user.provider === 'wechat' ? '微信' : '支付宝'}</p>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">性别</p>
              <p className="text-white">{user.profile?.gender === 'male' ? '男' : user.profile?.gender === 'female' ? '女' : '不便透露'}</p>
            </div>
            <div>
              <p className="text-gray-400">地区</p>
              <p className="text-white">{user.profile?.location || '未设置'}</p>
            </div>
            {user.profile?.birthday && (
              <div className="col-span-2">
                <p className="text-gray-400">生日</p>
                <p className="text-white">{user.profile.birthday}</p>
              </div>
            )}
          </div>

          {/* 个人简介 */}
          {user.profile?.bio && (
            <div>
              <p className="text-gray-400 text-sm mb-1">个人简介</p>
              <p className="text-white text-sm">{user.profile.bio}</p>
            </div>
          )}

          {/* 注册时间 */}
          <div className="pt-4 border-t border-zinc-600/30">
            <p className="text-xs text-gray-500">
              注册时间: {new Date(user.created_at).toLocaleDateString('zh-CN')}
            </p>
            <p className="text-xs text-gray-500">
              最后登录: {new Date(user.last_login).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 