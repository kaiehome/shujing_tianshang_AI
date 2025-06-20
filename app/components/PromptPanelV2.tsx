"use client"
import { useState } from 'react'
import { toast } from 'react-hot-toast'

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

interface GenerationParams {
  aspectRatio: string;
  quality: string;
  styleStrength: number;
  resolution: string;
  lighting: string;
  mood: string;
}

export default function PromptPanelV2({ 
  prompt, 
  onChange,
  placeholder,
  onGenerate,
  isGenerating,
  remainingGenerations,
  maxDailyGenerations,
  canGenerate,
  isAuthenticated,
  isVip,
  params,
  setParams,
  onImageUpload,
  onRemoveImage,
  imagePreviews
}: {
  prompt: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onGenerate: () => void;
  isGenerating: boolean;
  remainingGenerations: number;
  maxDailyGenerations: number;
  canGenerate: boolean;
  isAuthenticated: boolean;
  isVip: boolean;
  params: GenerationParams;
  setParams: (params: GenerationParams) => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: (index: number) => void;
  imagePreviews: string[];
}) {

  // 内部处理图片上传，调用父组件的回调
  const handleImageUploadInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请只上传图片文件');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    onImageUpload(file);
    e.target.value = ''; // 清空 input，以便可以重复上传同一张图片
  };  

  // 动态渲染参数控件
  const renderParamControl = (key: keyof GenerationParams, value: string | number) => {
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
            setParams({
              ...params,
              [key]: selectedOption ? selectedOption.value : e.target.value
            })
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
        
        {/* 容器设为 relative 和 flex */}
        <div className="relative mb-4 flex">
          <textarea
            className="w-full h-40 bg-zinc-700/80 border border-zinc-600/50 text-white rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-zinc-500/70 leading-relaxed"
            style={{paddingLeft: imagePreviews.length > 0 ? `${imagePreviews.length * 4 + 1}rem` : '1rem'}} // 动态计算左侧内边距
            value={prompt}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || '详细描述您想要生成的图像...'}
          />
          
          {/* 图片上传/预览区域 - absolute 定位到左下角 */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* 渲染预览图 */}
            {imagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative group w-14 h-14">
                <img
                  src={previewUrl}
                  alt={`上传预览 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-green-500"
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform hover:scale-110"
                  title="移除图片"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            {/* 上传按钮 (当图片少于3张时显示) */}
            {imagePreviews.length < 3 && (
              <div className="group relative">
                <label>
                  <input type="file" accept="image/*" onChange={handleImageUploadInternal} className="hidden"/>
                  <div 
                    className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-100 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span className="text-xs text-white/70 mt-1">添加</span>
                  </div>
                </label>
                {/* Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-100 delay-300 whitespace-nowrap z-10 pointer-events-none">
                  上传参考图 (图生图)
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>

          {/* 字符计数 */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {prompt.length}/500
          </div>
        </div>
        
        {/* 参数控件一排显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {displayParams.map(key => renderParamControl(key as keyof GenerationParams, params[key as keyof GenerationParams] as string | number))}
        </div>
        
        {/* 生成按钮和剩余次数 */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            {isAuthenticated ? (
              isVip ? (
                '无限制使用'
              ) : (
                `今日剩余：${remainingGenerations}/${maxDailyGenerations}次`
              )
            ) : (
              '访客模式：限时免费体验'
            )}
          </div>
          
          <button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className={`
              px-6 py-2.5 rounded-lg font-medium text-white
              transition-all duration-200
              flex items-center gap-2
              ${canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                : 'bg-gray-600 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                立即生成
              </>
            )}
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