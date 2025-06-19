'use client'
import { useState, Dispatch, SetStateAction } from 'react'

export const STYLE_PRESETS = [
  {
    id: 'none',
    name: '无风格',
    description: '无风格，保留原始特征',
    gradient: 'from-gray-400 to-gray-500',
    preview: '/presets/none-preview.jpg'
  },
  {
    id: 'portrait',
    name: '人像',
    description: '专注于人像的精细刻画',
    gradient: 'from-red-400 to-pink-500',
    preview: '/presets/portrait-preview.jpg'
  },
  {
    id: 'portrait-cinematic',
    name: '电影人像',
    description: '电影般的人像质感和光影',
    gradient: 'from-teal-400 to-blue-500',
    preview: '/presets/portrait-cinematic-preview.jpg'
  },
  {
    id: 'portrait-fashion',
    name: '时尚人像',
    description: '时尚杂志风格的人像',
    gradient: 'from-purple-400 to-indigo-500',
    preview: '/presets/portrait-fashion-preview.jpg'
  },
  {
    id: 'ray-traced',
    name: '光线追踪',
    description: '逼真的光线追踪渲染效果',
    gradient: 'from-green-400 to-cyan-500',
    preview: '/presets/ray-traced-preview.jpg'
  },
  {
    id: 'stock-photo',
    name: '图库照片',
    description: '高质量的图库照片风格',
    gradient: 'from-yellow-400 to-orange-500',
    preview: '/presets/stock-photo-preview.jpg'
  },
  {
    id: 'watercolor',
    name: '水彩画',
    description: '柔和的水彩画效果',
    gradient: 'from-blue-400 to-green-500',
    preview: '/presets/watercolor-preview.jpg'
  },
  {
    id: '3d-render',
    name: '3D渲染',
    description: '三维渲染效果',
    gradient: 'from-purple-500 to-pink-600',
    preview: '/presets/3d-render-preview.jpg'
  },
  {
    id: 'acrylic',
    name: '亚克力画',
    description: '亚克力绘画风格',
    gradient: 'from-red-500 to-orange-600',
    preview: '/presets/acrylic-preview.jpg'
  },
  {
    id: 'anime-general',
    name: '动漫风格',
    description: '通用的动漫风格',
    gradient: 'from-pink-500 to-purple-600',
    preview: '/presets/anime-general-preview.jpg'
  },
  {
    id: 'creative',
    name: '创意艺术',
    description: '富有创意和艺术感的风格',
    gradient: 'from-teal-500 to-blue-600',
    preview: '/presets/creative-preview.jpg'
  },
  {
    id: 'dynamic',
    name: '动感活力',
    description: '充满动感和活力的效果',
    gradient: 'from-green-500 to-cyan-600',
    preview: '/presets/dynamic-preview.jpg'
  },
  {
    id: 'fashion',
    name: '时尚前沿',
    description: '时尚前沿的视觉风格',
    gradient: 'from-yellow-500 to-orange-600',
    preview: '/presets/fashion-preview.jpg'
  },
  {
    id: 'game-concept',
    name: '游戏概念',
    description: '游戏概念艺术风格',
    gradient: 'from-purple-600 to-indigo-700',
    preview: '/presets/game-concept-preview.jpg'
  },
  {
    id: 'graphic-design-3d',
    name: '3D平面设计',
    description: '三维平面设计风格',
    gradient: 'from-blue-600 to-green-700',
    preview: '/presets/graphic-design-3d-preview.jpg'
  },
  {
    id: 'illustration',
    name: '插画艺术',
    description: '插画艺术风格',
    gradient: 'from-red-600 to-pink-700',
    preview: '/presets/illustration-preview.jpg'
  }
] as const;

export type StylePreset = typeof STYLE_PRESETS[number];

export default function StylePresets({ selectedStyle, setSelectedStyle }: {
  selectedStyle: string | null;
  setSelectedStyle: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {STYLE_PRESETS.map(preset => (
        <div 
          key={preset.id}
          className={`w-40 bg-white rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedStyle === preset.id ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
          }`}
          onClick={() => setSelectedStyle(preset.id)}
        >
          <div className={`h-20 rounded-lg flex items-center justify-center bg-gradient-to-r ${preset.gradient}`}>
            <span className="text-white font-medium text-sm text-center">{preset.name}</span>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-600 text-center">{preset.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}