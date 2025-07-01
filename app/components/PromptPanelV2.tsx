"use client"
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslations } from '../hooks/useTranslations'
import React from 'react'

interface GenerationParams {
  aspectRatio: string;
  quality: string;
  styleStrength: number;
  resolution: string;
  lighting: string;
  mood: string;
}

// 独立导出图片上传面板组件
export function ImageUploadPanel({ imagePreviews, onUpload, onRemove }: {
  imagePreviews: string[];
  onUpload: (file: File) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex gap-2 flex-wrap">
        {imagePreviews.map((url, idx) => (
          <div key={idx} className="relative group">
            <img src={url} alt="preview" className="w-16 h-16 object-cover rounded shadow border border-zinc-600" />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
              onClick={() => onRemove(idx)}
              title="移除图片"
            >×</button>
          </div>
        ))}
      </div>
      <label className="inline-block cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow">
        上传图片
        <input type="file" accept="image/*" className="hidden" onChange={e => {
          if (e.target.files && e.target.files[0]) onUpload(e.target.files[0]);
        }} />
      </label>
    </div>
  );
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
  const { t } = useTranslations()

  // 动态参数选项
  const paramOptions: Record<string, any> = {
    aspectRatio: [
      { value: '1:1', label: t.generation.paramOptions.aspectRatio['1:1'] },
      { value: '4:3', label: t.generation.paramOptions.aspectRatio['4:3'] },
      { value: '16:9', label: t.generation.paramOptions.aspectRatio['16:9'] },
      { value: '9:16', label: t.generation.paramOptions.aspectRatio['9:16'] }
    ],
    resolution: [
      { value: '512x512', label: t.generation.paramOptions.resolution['512x512'] },
      { value: '768x768', label: t.generation.paramOptions.resolution['768x768'] },
      { value: '1024x768', label: t.generation.paramOptions.resolution['1024x768'] },
      { value: '768x1024', label: t.generation.paramOptions.resolution['768x1024'] },
      { value: '1024x1024', label: t.generation.paramOptions.resolution['1024x1024'] }
    ],
    quality: [
      { value: 'draft', label: t.generation.paramOptions.quality.draft },
      { value: 'standard', label: t.generation.paramOptions.quality.standard },
      { value: 'high', label: t.generation.paramOptions.quality.high },
      { value: 'ultra', label: t.generation.paramOptions.quality.ultra }
    ],
    styleStrength: [
      { value: 0.3, label: t.generation.paramOptions.styleStrength['0.3'] },
      { value: 0.5, label: t.generation.paramOptions.styleStrength['0.5'] },
      { value: 0.7, label: t.generation.paramOptions.styleStrength['0.7'] },
      { value: 0.9, label: t.generation.paramOptions.styleStrength['0.9'] }
    ],
    lighting: [
      { value: '', label: t.generation.paramOptions.lighting[''] },
      { value: 'soft', label: t.generation.paramOptions.lighting.soft },
      { value: 'hard', label: t.generation.paramOptions.lighting.hard },
      { value: 'dramatic', label: t.generation.paramOptions.lighting.dramatic },
      { value: 'natural', label: t.generation.paramOptions.lighting.natural },
      { value: 'studio', label: t.generation.paramOptions.lighting.studio }
    ],
    mood: [
      { value: '', label: t.generation.paramOptions.mood[''] },
      { value: 'warm', label: t.generation.paramOptions.mood.warm },
      { value: 'cool', label: t.generation.paramOptions.mood.cool },
      { value: 'vibrant', label: t.generation.paramOptions.mood.vibrant },
      { value: 'muted', label: t.generation.paramOptions.mood.muted },
      { value: 'mysterious', label: t.generation.paramOptions.mood.mysterious }
    ]
  }

  const paramLabels: Record<string, string> = {
    aspectRatio: t.generation.paramLabels.aspectRatio,
    resolution: t.generation.paramLabels.resolution,
    quality: t.generation.paramLabels.quality,
    styleStrength: t.generation.paramLabels.styleStrength,
    lighting: t.generation.paramLabels.lighting,
    mood: t.generation.paramLabels.mood
  }

  const paramDescriptions: Record<string, string> = {
    aspectRatio: t.generation.paramDescriptions.aspectRatio,
    resolution: t.generation.paramDescriptions.resolution,
    quality: t.generation.paramDescriptions.quality,
    styleStrength: t.generation.paramDescriptions.styleStrength,
    lighting: t.generation.paramDescriptions.lighting,
    mood: t.generation.paramDescriptions.mood
  }

  // 内部处理图片上传，调用父组件的回调
  const handleImageUploadInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t.generation.uploadImageFileOnly);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.generation.imageSizeLimit);
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
        <label className="block text-sm font-medium text-gray-300 mb-3">{t.generation.promptDescription}</label>
        
        {/* 容器设为 relative 和 flex */}
        <div className="mb-4">
          <div className="relative">
            <textarea
              className="w-full h-40 bg-zinc-700/80 border border-zinc-600/50 text-white rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-zinc-500/70 leading-relaxed"
              value={prompt}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder || t.generation.promptPlaceholderDetailed}
              maxLength={500}
            />
            {/* 字符计数 */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {prompt.length}/500
            </div>
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
                t.generation.statusMessages.vip
              ) : (
                t.generation.statusMessages.remainingToday
                  .replace('{remaining}', remainingGenerations.toString())
                  .replace('{total}', maxDailyGenerations.toString())
              )
            ) : (
              t.generation.statusMessages.guestMode
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
                {t.generation.generating}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t.generation.generateNow}
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
              {t.generation.promptTips.title}
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              {!prompt.trim() ? (
                t.generation.promptTips.emptyPrompt
              ) : (
                t.generation.promptTips.withPrompt
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 