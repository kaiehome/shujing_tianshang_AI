"use client"
import { useState, useEffect } from 'react'
import { AntiSpamService } from '../lib/antiSpam'

export default function DevAntiSpamStatus() {
  const [deviceId, setDeviceId] = useState<string>('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // 获取设备ID
    const storedDeviceId = localStorage.getItem('device_id')
    if (storedDeviceId) {
      setDeviceId(storedDeviceId)
      
      // 获取防刷统计
      const antiSpam = AntiSpamService.getInstance()
      const deviceStats = antiSpam.getDeviceStats(storedDeviceId)
      setStats(deviceStats)
    }
  }, [])

  const clearAntiSpamData = () => {
    const antiSpam = AntiSpamService.getInstance()
    antiSpam.clearAllData()
    setStats(null)
    window.location.reload()
  }

  if (!stats) {
    return <div className="text-gray-500 text-xs">暂无防刷数据</div>
  }

  return (
    <div className="space-y-1 text-xs">
      <div className="text-gray-300">
        设备ID: <span className="text-blue-400">{deviceId.substring(0, 16)}...</span>
      </div>
      <div className="text-gray-300">
        总生成次数: <span className="text-green-400">{stats.totalGenerations}</span>
      </div>
      <div className="text-gray-300">
        今日生成: <span className="text-yellow-400">{stats.todayGenerations}</span>
      </div>
      <div className="text-gray-300">
        独特提示词: <span className="text-purple-400">{stats.uniquePrompts}</span>
      </div>
      <div className="text-gray-300">
        可疑状态: <span className={stats.isSuspicious ? "text-red-400" : "text-green-400"}>
          {stats.isSuspicious ? "是" : "否"}
        </span>
      </div>
      
      <button
        onClick={clearAntiSpamData}
        className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded border border-red-500/30 transition-colors text-xs"
      >
        清除防刷数据
      </button>
    </div>
  )
} 