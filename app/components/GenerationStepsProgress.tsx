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
    <div className="w-full max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl backdrop-blur-sm">
      {/* 标题区域 - 重新设计确保完整显示 */}
      <div className="w-full text-center mb-8 px-4 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-2xl">🎨</span>
          <h3 className="text-xl font-bold text-white">
            AI图像生成进行中
          </h3>
          <span className="text-2xl">✨</span>
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
                w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white' : 
                  isActive ? 'bg-blue-500 text-white animate-pulse' :
                  hasError ? 'bg-red-500 text-white' :
                  'bg-gray-600 text-gray-300'}
              `}>
                {hasError ? '❌' : isCompleted ? '✅' : step.icon}
              </div>
              
              {/* 步骤标题 */}
              <div className="mt-3 text-center">
                <div className={`font-medium text-sm ${
                  isActive ? 'text-blue-400' :
                  isCompleted ? 'text-green-400' :
                  hasError ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </div>
              </div>

              {/* 活动指示器 */}
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">
            {error ? '生成失败' : `第${currentStep + 1}步 / 共${steps.length}步`}
          </span>
          <span className="text-sm text-blue-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              error ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 当前步骤详情 */}
      {!error && currentStep < steps.length && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-medium">
              {steps[currentStep]?.title} - {steps[currentStep]?.description}
            </span>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg">
            <span className="text-red-400 text-sm">
              ❌ {error}
            </span>
          </div>
        </div>
      )}

      {/* 完成状态 */}
      {currentStep >= steps.length && !error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
            <span className="text-green-400 text-sm font-medium">
              ✨ 生成完成！正在展示结果...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// 预定义的生成步骤
export const DEFAULT_GENERATION_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: '第一步',
    description: 'AI理解分析',
    icon: '🧠',
    status: 'pending'
  },
  {
    id: 2,
    title: '第二步', 
    description: '提示词优化',
    icon: '✨',
    status: 'pending'
  },
  {
    id: 3,
    title: '第三步',
    description: '图像生成',
    icon: '🎨',
    status: 'pending'
  },
  {
    id: 4,
    title: '完成',
    description: '结果展示',
    icon: '🎉',
    status: 'pending'
  }
] 