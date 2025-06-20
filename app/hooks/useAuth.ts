"use client"

import { useState, useEffect, useCallback } from 'react'
import { User, AuthResult } from '../lib/auth/types'

interface UseAuthReturn {
  // 状态
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isVip: boolean
  
  // 认证方法
  sendSmsCode: (phone: string, type?: 'login' | 'register') => Promise<{ success: boolean; error?: string }>
  loginWithPhone: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>
  loginWithWechat: () => Promise<{ success: boolean; error?: string }>
  loginWithAlipay: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  
  // 用户资料
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取当前用户信息
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.user) {
          setUser(data.data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始化时获取用户信息
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  // 发送短信验证码
  const sendSmsCode = useCallback(async (phone: string, type: 'login' | 'register' = 'login') => {
    try {
      const response = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, type })
      })

      const data = await response.json()
      
      if (data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: '发送验证码失败，请重试' }
    }
  }, [])

  // 手机验证码登录
  const loginWithPhone = useCallback(async (phone: string, code: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ phone, code })
      })

      const data = await response.json()
      
      if (data.success) {
        setUser(data.data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: '登录失败，请重试' }
    } finally {
      setLoading(false)
    }
  }, [])

  // 微信登录
  const loginWithWechat = useCallback(async () => {
    try {
      // 直接跳转到OAuth启动端点
      window.location.href = '/api/auth/oauth/wechat'
      return { success: true }
    } catch (error) {
      return { success: false, error: '微信登录失败，请重试' }
    }
  }, [])

  // 支付宝登录
  const loginWithAlipay = useCallback(async () => {
    try {
      // 直接跳转到OAuth启动端点
      window.location.href = '/api/auth/oauth/alipay'
      return { success: true }
    } catch (error) {
      return { success: false, error: '支付宝登录失败，请重试' }
    }
  }, [])

  // 登出
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
    } catch (error) {
      console.error('登出失败:', error)
      // 即使API调用失败，也清除本地状态
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 更新用户资料
  const updateProfile = useCallback(async (updates: any) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      
      if (data.success) {
        // 刷新用户信息
        await fetchCurrentUser()
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: '更新资料失败，请重试' }
    }
  }, [fetchCurrentUser])

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    await fetchCurrentUser()
  }, [fetchCurrentUser])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isVip: !!user?.isVip,
    sendSmsCode,
    loginWithPhone,
    loginWithWechat,
    loginWithAlipay,
    logout,
    updateProfile,
    refreshUser
  }
} 