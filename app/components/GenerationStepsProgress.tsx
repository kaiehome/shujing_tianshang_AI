"use client"
import React from 'react'

interface GenerationStep {
  id: number
  title: string
  description: string
  icon: string
  status: 'pending' | 'active' | 'completed' | 'error'
}

interface GenerationStepsProgressProps {
  isVisible: boolean
  currentStep: number
  steps: GenerationStep[]
  progress: number
  error?: string | null
}

export default function GenerationStepsProgress({
  isVisible,
  currentStep,
  steps,
  progress,
  error
}: GenerationStepsProgressProps) {
  if (!isVisible) return null

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-blue-500/50 rounded-xl backdrop-blur-sm shadow-2xl shadow-blue-500/20 animate-pulse-border animate-slide-in-up">
      {/* 标题区域 - 重新设计确保完整显示 */}
      <div className="w-full text-center mb-8 px-4 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-2xl animate-bounce">🎨</span>
          <h3 className="text-xl font-bold text-white">
            AI图像生成进行中
          </h3>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</span>
        </div>
        <p className="text-gray-300 text-sm font-medium">
          正在使用多模型协作为您生成高质量图像
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-xs">请稍候，AI正在努力工作中...</span>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-between mb-6 relative">
        {/* 连接线 */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-600 z-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isPending = index > currentStep
          const hasError = step.status === 'error'

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* 步骤圆圈 */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 relative
                ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 
                  isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse shadow-lg shadow-blue-500/40' :
                  hasError ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                  'bg-gray-600 text-gray-300 border-2 border-gray-500'}
              `}>
                {hasError ? '❌' : isCompleted ? '✅' : isActive ? step.icon : step.icon}
                
                {/* 活动状态的光环效果 */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping opacity-30"></div>
                )}
                
                {/* 完成状态的成功光环 */}
                {isCompleted && (
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-20"></div>
                )}
              </div>
              
              {/* 步骤标题 */}
              <div className="mt-3 text-center">
                <div className={`font-medium text-sm transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' :
                  isCompleted ? 'text-green-400 font-semibold' :
                  hasError ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className={`text-xs mt-1 max-w-24 transition-colors duration-300 ${
                  isActive ? 'text-blue-300' :
                  isCompleted ? 'text-green-300' :
                  hasError ? 'text-red-300' :
                  'text-gray-500'
                }`}>
                  {step.description}
                </div>
              </div>

              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              
              {/* 完成指示器 */}
              {isCompleted && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-300 font-medium">
            {error ? '❌ 生成失败' : `🎨 第${currentStep + 1}步 / 共${steps.length}步`}
          </span>
          <span className="text-sm font-bold">
            <span className={`${error ? 'text-red-400' : 'text-blue-400'}`}>
              {Math.round(progress)}%
            </span>
            {!error && progress > 0 && progress < 100 && (
              <span className="text-gray-400 text-xs ml-1">进行中</span>
            )}
            {!error && progress === 100 && currentStep < steps.length - 1 && (
              <span className="text-green-400 text-xs ml-1">完成</span>
            )}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-700 ease-out relative ${
              error ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* 进度条动画效果 */}
            {!error && progress > 0 && progress < 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            )}
          </div>
          {/* 进度条光效 */}
          {!error && progress > 10 && (
            <div 
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
              style={{ left: `${Math.max(0, progress - 8)}%` }}
            ></div>
          )}
        </div>
      </div>

      {/* 当前步骤详情 */}
      {!error && currentStep < steps.length && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-blue-300 text-sm font-medium">
              正在{steps[currentStep]?.description}，请耐心等待...
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 rounded-lg border border-red-400/30">
            <span className="text-2xl">❌</span>
            <span className="text-red-400 text-sm font-medium">
              {error}
            </span>
            <span className="text-red-300 text-xs">
              请检查网络连接后重试
            </span>
          </div>
        </div>
      )}

      {/* 完成状态 */}
      {currentStep >= steps.length && !error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30">
            <span className="text-2xl animate-bounce">🎉</span>
            <span className="text-green-400 text-sm font-medium">
              创作完成！正在为您展示精美作品...
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 预定义的生成步骤 - 更用户友好的描述
export const DEFAULT_GENERATION_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: '第一步',
    description: '准备创作',
    icon: '🧠',
    status: 'pending'
  },
  {
    id: 2,
    title: '第二步', 
    description: '理解需求',
    icon: '✨',
    status: 'pending'
  },
  {
    id: 3,
    title: '第三步',
    description: 'AI绘画中',
    icon: '🎨',
    status: 'pending'
  },
  {
    id: 4,
    title: '完成',
    description: '作品呈现',
    icon: '🎉',
    status: 'pending'
  }
] 