"use client"
import { useState } from 'react'
import ImageResultGallery, { ImageData } from '../components/ImageResultGallery'
import { toast } from 'react-hot-toast'
import { useTranslations } from '../hooks/useTranslations'

// 比例选项图片映射
const aspectRatios = [
  { value: '1:1', label: '1:1 正方形', img: '/presets/ratio-1-1.png' },
  { value: '3:4', label: '3:4 竖图', img: '/presets/ratio-3-4.png' },
  { value: '4:3', label: '4:3 横图', img: '/presets/ratio-4-3.png' },
  { value: '16:9', label: '16:9 宽屏', img: '/presets/ratio-16-9.png' },
  { value: '9:16', label: '9:16 竖屏', img: '/presets/ratio-9-16.png' },
]
const numImagesOptions = [
  { value: 1, label: '1', img: '/presets/num-1.png' },
  { value: 2, label: '2', img: '/presets/num-2.png' },
  { value: 3, label: '3', img: '/presets/num-3.png' },
  { value: 4, label: '4', img: '/presets/num-4.png' },
]

export default function Image2ImagePage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<ImageData[]>([])
  const { t } = useTranslations()
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [numImages, setNumImages] = useState(1)
  const [aiPrompt, setAiPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showAiPromptInput, setShowAiPromptInput] = useState(false)
  const [showNegativePromptInput, setShowNegativePromptInput] = useState(false)
  const [tempNegativePrompt, setTempNegativePrompt] = useState('')
  const [tempAiPrompt, setTempAiPrompt] = useState('')

  // 处理图片上传
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t.generation.uploadImageFileOnly)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.generation.imageSizeLimit)
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
  // 处理图片移除
  const handleRemove = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }
  // 生成逻辑（可对接后端API）
  const handleGenerate = async () => {
    if (!imageFile) return
    setIsGenerating(true)
    try {
      setTimeout(() => {
        toast.success(t.common.success)
        setResults(prev => [
          ...prev,
          { id: `img-${Date.now()}`, url: imagePreview!, timestamp: Date.now(), prompt }
        ])
        setIsGenerating(false)
      }, 1500)
    } catch (e) {
      toast.error(t.common.failed)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center py-12 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-10 text-blue-700 tracking-tight">{t.generation.inputPrompt} <span className="text-base text-blue-400 font-normal">(Image2Image)</span></h1>
      {/* 参数区 Notion风横向卡片 - 4等宽模块 */}
      <div className="grid grid-cols-4 gap-6 mb-8 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-blue-50">
        {/* 画面比例 */}
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-blue-100 px-4 py-6 shadow-sm min-h-[90px]">
          <span className="text-gray-500 text-sm font-medium mb-2">画面比例</span>
          <select
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-lg text-[#222] font-bold appearance-none focus:ring-2 focus:ring-blue-200 text-center"
            value={aspectRatio}
            onChange={e => setAspectRatio(e.target.value)}
          >
            {aspectRatios.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* 生成数量 */}
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-blue-100 px-4 py-6 shadow-sm min-h-[90px]">
          <span className="text-gray-500 text-sm font-medium mb-2">生成数量</span>
          <select
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-lg text-[#222] font-bold appearance-none focus:ring-2 focus:ring-blue-200 text-center"
            value={numImages}
            onChange={e => setNumImages(Number(e.target.value))}
          >
            {numImagesOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* 负面提示词按钮 */}
        <button
          className={`flex flex-col items-center justify-center bg-white rounded-2xl border border-blue-100 px-4 py-6 shadow-sm min-h-[90px] w-full transition-all ${showNegativePromptInput ? 'ring-2 ring-blue-200' : ''}`}
          onClick={() => { setTempNegativePrompt(negativePrompt); setShowNegativePromptInput(true); }}
        >
          <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#60a5fa">!</text></svg>
          <span className="text-base text-gray-600 font-bold">负面提示词</span>
        </button>
        {/* AI生成提示词按钮 */}
        <button
          className={`flex flex-col items-center justify-center bg-white rounded-2xl border border-blue-100 px-4 py-6 shadow-sm min-h-[90px] w-full transition-all ${showAiPromptInput ? 'ring-2 ring-blue-200' : ''}`}
          onClick={() => { setTempAiPrompt(aiPrompt); setShowAiPromptInput(true); }}
        >
          <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#60a5fa">AI</text></svg>
          <span className="text-base text-gray-600 font-bold">AI提示词生成</span>
        </button>
      </div>
      {/* 负向提示词弹窗 - Notion风浮层卡片 */}
      {showNegativePromptInput && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-40 bg-black/20" onClick={() => setShowNegativePromptInput(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-[#ececf1] p-8 min-w-[420px] relative flex flex-col" onClick={e => e.stopPropagation()}>
            <button className="absolute top-5 right-6 text-gray-400 hover:text-blue-400 text-2xl" onClick={() => setShowNegativePromptInput(false)}>&times;</button>
            <div className="mb-2 text-xl font-bold text-[#222]">负向提示词</div>
            <div className="mb-3 text-gray-500 text-sm">你不希望生成的图片出现什么元素</div>
            <textarea
              className="w-full h-24 px-4 py-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] text-gray-700 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              placeholder="请输入负向提示词"
              value={tempNegativePrompt}
              onChange={e => setTempNegativePrompt(e.target.value)}
              maxLength={300}
            />
            <div className="flex justify-between items-center mt-1 mb-6 text-gray-400 text-xs">
              <span></span>
              <span>{tempNegativePrompt.length} / 300</span>
            </div>
            <button
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base transition-all"
              onClick={() => { setNegativePrompt(tempNegativePrompt); setShowNegativePromptInput(false); }}
            >确认保存</button>
          </div>
        </div>
      )}
      {/* AI生成提示词弹窗 - Notion风浮层卡片 */}
      {showAiPromptInput && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-40 bg-black/20" onClick={() => setShowAiPromptInput(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-[#ececf1] p-8 min-w-[420px] relative flex flex-col" onClick={e => e.stopPropagation()}>
            <button className="absolute top-5 right-6 text-gray-400 hover:text-blue-400 text-2xl" onClick={() => setShowAiPromptInput(false)}>&times;</button>
            <div className="mb-2 text-xl font-bold text-[#222]">AI提示词生成</div>
            <div className="mb-3 text-gray-500 text-sm">写一段简单的描述，自动为你补充生成完善的描述信息</div>
            <textarea
              className="w-full h-24 px-4 py-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] text-gray-700 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              placeholder="请输入AI生成提示词"
              value={tempAiPrompt}
              onChange={e => setTempAiPrompt(e.target.value)}
              maxLength={300}
            />
            <div className="flex justify-between items-center mt-1 mb-6 text-gray-400 text-xs">
              <span></span>
              <span>{tempAiPrompt.length} / 300</span>
            </div>
            <button
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base transition-all"
              onClick={() => { setAiPrompt(tempAiPrompt); setShowAiPromptInput(false); }}
            >生成提示词</button>
          </div>
        </div>
      )}
      {/* 下方上传+输入+按钮区 - Notion风大卡片 */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-row items-center gap-8 mx-auto border border-blue-50">
        {/* 上传区 */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl w-28 h-28 cursor-pointer hover:bg-blue-50 transition text-center mr-6">
          {imagePreview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={imagePreview} className="w-24 h-24 object-cover rounded-2xl" />
              <button className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition text-xs" onClick={e => { e.stopPropagation(); handleRemove(); }}>&times;</button>
            </div>
          ) : (
            <span className="text-4xl text-blue-300">＋</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={e => {
            if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
          }} />
        </label>
        {/* 输入区 */}
        <textarea
          className="flex-1 min-h-[96px] rounded-xl border border-blue-100 bg-white px-4 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-blue-300 resize-none"
          placeholder={t.generation.promptPlaceholderDetailed}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2 text-gray-400 text-sm">
          <span>{t.generation.inputPrompt}</span>
          <span>{prompt.length} / 500</span>
        </div>
        {/* 生成按钮 */}
        <button
          className="ml-6 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
          disabled={!imageFile || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? t.generation.generating : t.generation.generateNow}
        </button>
      </div>
      <div className="w-full max-w-4xl mt-10">
        <ImageResultGallery images={results} isGenerating={isGenerating} />
      </div>
    </div>
  )
} 