import { useState, useEffect } from 'react'
import { AntiSpamService } from '../lib/antiSpam'

interface GuestState {
  isGuest: boolean
  dailyGenerations: number
  maxDailyGenerations: number
  lastResetDate: string
  deviceId: string
}

interface UseGuestReturn {
  isGuestMode: boolean
  canGenerate: boolean
  remainingGenerations: number
  maxDailyGenerations: number
  incrementGeneration: (prompt: string) => boolean
  showRegistrationModal: boolean
  setShowRegistrationModal: (show: boolean) => void
  resetDailyLimit: () => void
  antiSpamMessage: string | null
}

const GUEST_STORAGE_KEY = 'guest_state'
const MAX_DAILY_GENERATIONS = 3 // 每日最多生成3次（每次可生成多张图片）

export function useGuest(): UseGuestReturn {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
  const [guestState, setGuestState] = useState<GuestState>({
    isGuest: true,
    dailyGenerations: 0,
    maxDailyGenerations: MAX_DAILY_GENERATIONS,
    lastResetDate: new Date().toDateString(),
    deviceId: ''
  })
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [antiSpamMessage, setAntiSpamMessage] = useState<string | null>(null)

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const isLoggedIn = response.ok
        setIsUserLoggedIn(isLoggedIn)
      } catch (error) {
        setIsUserLoggedIn(false)
      }
    }
    
    checkAuth()
  }, [])

  // 生成设备ID
  function generateDeviceId(): string {
    if (typeof window === 'undefined') return ''
    
    const stored = localStorage.getItem('device_id')
    if (stored) return stored
    
    const deviceId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('device_id', deviceId)
    return deviceId
  }

  // 从本地存储加载访客状态
  useEffect(() => {
    if (isUserLoggedIn === null || typeof window === 'undefined') return

    if (isUserLoggedIn) {
      // 已登录用户
      setGuestState(prev => ({ ...prev, isGuest: false }))
    } else {
      // 访客用户
      const stored = localStorage.getItem(GUEST_STORAGE_KEY)
      if (stored) {
        try {
          const parsedState: GuestState = JSON.parse(stored)
          const today = new Date().toDateString()
          
          // 检查是否需要重置每日计数
          if (parsedState.lastResetDate !== today) {
            parsedState.dailyGenerations = 0
            parsedState.lastResetDate = today
          }
          
          setGuestState({
            ...parsedState,
            isGuest: true,
            maxDailyGenerations: MAX_DAILY_GENERATIONS,
            deviceId: generateDeviceId()
          })
        } catch (error) {
          console.error('解析访客状态失败:', error)
          resetGuestState()
        }
      } else {
        resetGuestState()
      }
    }
  }, [isUserLoggedIn])

  // 重置访客状态
  function resetGuestState() {
    if (typeof window === 'undefined') return
    
    const newState: GuestState = {
      isGuest: true,
      dailyGenerations: 0,
      maxDailyGenerations: MAX_DAILY_GENERATIONS,
      lastResetDate: new Date().toDateString(),
      deviceId: generateDeviceId()
    }
    setGuestState(newState)
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newState))
  }

  // 保存状态到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined' && guestState.isGuest && guestState.deviceId) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestState))
    }
  }, [guestState])

  // 增加生成次数
  function incrementGeneration(prompt: string = ''): boolean {
    if (!guestState.isGuest) return true // 注册用户无限制

    // 检查每日限制
    if (guestState.dailyGenerations >= guestState.maxDailyGenerations) {
      setShowRegistrationModal(true)
      return false
    }

    // 检查防刷限制
    if (guestState.deviceId && prompt) {
      const antiSpam = AntiSpamService.getInstance()
      const spamCheck = antiSpam.canGenerate(guestState.deviceId, prompt)
      
      if (!spamCheck.allowed) {
        setAntiSpamMessage(spamCheck.reason || '生成频率过高，请稍后再试')
        
        // 显示倒计时
        if (spamCheck.waitTime) {
          const waitSeconds = Math.ceil(spamCheck.waitTime / 1000)
          setAntiSpamMessage(`${spamCheck.reason}，还需等待 ${waitSeconds} 秒`)
          
          // 定时更新倒计时
          const timer = setInterval(() => {
            const remaining = Math.ceil((spamCheck.waitTime! - (Date.now() - Date.now())) / 1000)
            if (remaining <= 0) {
              setAntiSpamMessage(null)
              clearInterval(timer)
            } else {
              setAntiSpamMessage(`${spamCheck.reason}，还需等待 ${remaining} 秒`)
            }
          }, 1000)
        }
        
        return false
      }

      // 记录生成行为
      antiSpam.recordGeneration(guestState.deviceId, prompt)
    }

    setGuestState(prev => ({
      ...prev,
      dailyGenerations: prev.dailyGenerations + 1
    }))

    // 清除防刷消息
    setAntiSpamMessage(null)

    // 如果达到限制，显示注册引导
    if (guestState.dailyGenerations + 1 >= guestState.maxDailyGenerations) {
      setTimeout(() => setShowRegistrationModal(true), 1000)
    }

    return true
  }

  // 重置每日限制（用于测试）
  function resetDailyLimit() {
    setGuestState(prev => ({
      ...prev,
      dailyGenerations: 0,
      lastResetDate: new Date().toDateString()
    }))
    
    // 同时重置防刷记录
    if (guestState.deviceId) {
      const antiSpam = AntiSpamService.getInstance()
      antiSpam.resetDevice(guestState.deviceId)
    }
    
    setAntiSpamMessage(null)
  }

  return {
    isGuestMode: guestState.isGuest,
    canGenerate: !guestState.isGuest || (
      guestState.dailyGenerations < guestState.maxDailyGenerations && 
      !antiSpamMessage
    ),
    remainingGenerations: guestState.isGuest 
      ? Math.max(0, guestState.maxDailyGenerations - guestState.dailyGenerations)
      : Infinity,
    maxDailyGenerations: guestState.maxDailyGenerations,
    incrementGeneration,
    showRegistrationModal,
    setShowRegistrationModal,
    resetDailyLimit,
    antiSpamMessage
  }
} 