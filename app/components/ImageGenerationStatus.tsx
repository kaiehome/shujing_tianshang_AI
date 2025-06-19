"use client"
import React, { useState, useEffect } from 'react'

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'checking'
  responseTime?: number
  lastCheck?: Date
  error?: string
}

interface ImageGenerationStatusProps {
  className?: string
}

export default function ImageGenerationStatus({ className = '' }: ImageGenerationStatusProps) {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Hugging Face', status: 'checking' },
    { name: 'Replicate', status: 'checking' },
    { name: 'Stability AI', status: 'checking' }
  ])
  const [isExpanded, setIsExpanded] = useState(false)

  // 检查服务状态
  const checkServiceStatus = async () => {
    const updatedServices: ServiceStatus[] = []

    for (const service of services) {
      const startTime = Date.now()
      try {
        // 这里可以添加实际的服务状态检查逻辑
        // 目前使用模拟检查
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        const responseTime = Date.now() - startTime
        const isOnline = Math.random() > 0.2 // 80%概率在线
        
        updatedServices.push({
          name: service.name,
          status: isOnline ? 'online' : 'offline',
          responseTime: isOnline ? responseTime : undefined,
          lastCheck: new Date(),
          error: isOnline ? undefined : '服务暂时不可用'
        })
      } catch (error) {
        updatedServices.push({
          name: service.name,
          status: 'offline',
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : '检查失败'
        })
      }
    }

    setServices(updatedServices)
  }

  useEffect(() => {
    checkServiceStatus()
    // 每5分钟检查一次
    const interval = setInterval(checkServiceStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const onlineServices = services.filter(s => s.status === 'online').length
  const totalServices = services.length

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return 'text-green-400'
      case 'offline': return 'text-red-400'
      case 'checking': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return '🟢'
      case 'offline': return '🔴'
      case 'checking': return '🟡'
      default: return '⚪'
    }
  }

  return (
    <div className={`bg-zinc-800/50 border border-zinc-600/30 rounded-lg p-4 ${className}`}>
      {/* 状态概览 */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🖼️</span>
          <div>
            <h3 className="text-sm font-medium text-white">图像生成服务</h3>
            <p className="text-xs text-gray-400">
              {onlineServices}/{totalServices} 个服务在线
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 整体状态指示器 */}
          <div className={`w-3 h-3 rounded-full ${
            onlineServices === totalServices ? 'bg-green-500' :
            onlineServices > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          
          {/* 展开/收起按钮 */}
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 详细状态 */}
      {isExpanded && (
        <div className="mt-4 space-y-2">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-zinc-700/30 rounded">
              <div className="flex items-center gap-3">
                <span className="text-sm">{getStatusIcon(service.status)}</span>
                <div>
                  <span className="text-sm text-white font-medium">{service.name}</span>
                  {service.error && (
                    <p className="text-xs text-red-400">{service.error}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status === 'checking' ? '检查中...' :
                   service.status === 'online' ? '在线' : '离线'}
                </span>
                {service.responseTime && (
                  <p className="text-xs text-gray-400">{service.responseTime}ms</p>
                )}
                {service.lastCheck && (
                  <p className="text-xs text-gray-500">
                    {service.lastCheck.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* 刷新按钮 */}
          <button
            onClick={checkServiceStatus}
            className="w-full mt-3 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded text-blue-400 text-sm font-medium transition-colors"
          >
            🔄 刷新状态
          </button>
        </div>
      )}
    </div>
  )
} 