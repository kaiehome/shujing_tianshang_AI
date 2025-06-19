"use client"
import { useState } from 'react'

const paramOptions: Record<string, any> = {
  aspectRatio: [
    { value: '1:1', label: '⬜ 1:1 正方形' },
    { value: '4:3', label: '📺 4:3 传统屏' },
    { value: '16:9', label: '🖥️ 16:9 宽屏' },
    { value: '9:16', label: '📱 9:16 竖屏' }
  ],
  resolution: [
    { value: '512x512', label: '512×512 (标准)' },
    { value: '768x768', label: '768×768 (高清)' },
    { value: '1024x768', label: '1024×768 (横版高清)' },
    { value: '768x1024', label: '768×1024 (竖版高清)' },
    { value: '1024x1024', label: '1024×1024 (超高清)' }
  ],
  quality: [
    { value: 'draft', label: '草图 (快速)' },
    { value: 'standard', label: '标准质量' },
    { value: 'high', label: '高质量' },
    { value: 'ultra', label: '超高质量 (慢)' }
  ],
  styleStrength: [
    { value: 0.3, label: '轻微 (30%)' },
    { value: 0.5, label: '适中 (50%)' },
    { value: 0.7, label: '标准 (70%)' },
    { value: 0.9, label: '强烈 (90%)' }
  ],
  lighting: [
    { value: '', label: '自动光照' },
    { value: 'soft', label: '柔光' },
    { value: 'hard', label: '硬光' },
    { value: 'dramatic', label: '戏剧光' },
    { value: 'natural', label: '自然光' },
    { value: 'studio', label: '影棚光' }
  ],
  mood: [
    { value: '', label: '默认氛围' },
    { value: 'warm', label: '温暖' },
    { value: 'cool', label: '冷色调' },
    { value: 'vibrant', label: '鲜艳' },
    { value: 'muted', label: '柔和' },
    { value: 'mysterious', label: '神秘' }
  ]
}

const paramLabels: Record<string, string> = {
  aspectRatio: '画面比例',
  resolution: '图像分辨率',
  quality: '生成质量', 
  styleStrength: '风格强度',
  lighting: '光照效果',
  mood: '色彩氛围'
}

const paramDescriptions: Record<string, string> = {
  aspectRatio: '控制生成图像的宽高比例',
  resolution: '越高的分辨率生成时间越长',
  quality: '影响图像细节和生成时间',
  styleStrength: '控制AI风格应用的强度',
  lighting: '影响图像的光影效果',
  mood: '影响图像的整体色调氛围'
}

export default function PromptPanelV2({ prompt, setPrompt, params, setParams, promptPlaceholder }: {
  prompt: string;
  setPrompt: (v: string) => void;
  params: any;
  setParams: (v: any) => void;
  promptPlaceholder?: string;
}) {
  // 动态渲染参数控件
  const renderParamControl = (key: string, value: any) => {
    const label = paramLabels[key] || key
    const description = paramDescriptions[key]
    const options = paramOptions[key]
    
    if (!options) return null

    return (
      <div key={key} className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {description && (
            <div className="group relative">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                {description}
              </div>
            </div>
          )}
        </div>
        <select
          className="w-full bg-zinc-700/80 border border-zinc-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-zinc-500/70"
          value={value || (options[0]?.value || '')}
          onChange={e => {
            const selectedOption = options.find((opt: any) => opt.value.toString() === e.target.value)
            setParams((prev: any) => ({ 
              ...prev, 
              [key]: selectedOption ? selectedOption.value : e.target.value 
            }))
          }}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // 按照要求的顺序：画面比例、光照效果、色彩氛围、风格强度
  const displayParams = ['aspectRatio', 'lighting', 'mood', 'styleStrength']

  return (
    <div className="w-full max-w-full">
      {/* 提示词输入区 - 包含输入框和参数设置 */}
      <div className="bg-zinc-800/50 border border-zinc-600/30 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-300 mb-3">描述提示词</label>
        
        {/* 修复重影问题的文本输入框 */}
        <div className="relative mb-4">
          <textarea
            className="w-full h-32 bg-zinc-700/80 border border-zinc-600/50 text-white rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-zinc-500/70"
            style={{lineHeight: 1.5}}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={promptPlaceholder || '详细描述您想要生成的图像...'}
          />
          
          {/* 字符计数 */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {prompt.length}/500
          </div>
        </div>
        
        {/* 参数控件一排显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {displayParams.map(key => renderParamControl(key, params[key]))}
        </div>
        
        {/* 参数重置按钮 */}
        <div className="flex justify-center">
          <button
            onClick={() => setParams({
              aspectRatio: '1:1',
              quality: 'standard',
              styleStrength: 0.7,
              resolution: '768x768',
              lighting: '',
              mood: ''
            })}
            className="px-4 py-2 text-xs text-gray-400 border border-zinc-600/50 rounded hover:border-zinc-500/70 hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置为默认参数
          </button>
        </div>
      </div>

      {/* 输入提示 */}
      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-blue-400 text-sm font-medium mb-1">
              💡 描述提示
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              {!prompt.trim() ? (
                <>可以直接点击<span className="font-semibold">&quot;立即生成&quot;</span>使用当前风格的默认提示词，
                也可以输入自己的描述来生成个性化图像。</>
              ) : (
                <>描述越详细，生成的图像越符合您的期望。可以包含：物体、场景、风格、颜色、光线等细节。</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 