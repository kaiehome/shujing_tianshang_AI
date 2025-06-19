'use client'
import { useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { WebSocketClient } from '../utils/websocket'
import Logo from './Logo'
import { translatePrompt, isChinese } from '../lib/translation'
import { toast } from 'react-hot-toast'
import { generateImage, optimizePrompt } from '../lib/ai'
import { useRouter } from 'next/navigation'
import SmartInput from './SmartInput'
import StyleTemplateSelector from './StyleTemplateSelector'
import { StyleTemplate } from '../lib/style-templates'

type AspectRatio = '2:3' | '1:1' | '16:9' | ''

export default function GenerationForm({ selectedStyle, setSelectedStyle, setGeneratedImages, isProUser = false }: {
  selectedStyle: string | null;
  setSelectedStyle: Dispatch<SetStateAction<string | null>>;
  setGeneratedImages: Dispatch<SetStateAction<string[]>>;
  isProUser?: boolean;
}) {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationStep, setOptimizationStep] = useState('')
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [translatedPrompt, setTranslatedPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<StyleTemplate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isHighQuality, setIsHighQuality] = useState(false)
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null)
  const [service, setService] = useState<'tongyi_wanxiang' | 'doubao'>('tongyi_wanxiang')
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // 创建WebSocket客户端
    const client = new WebSocketClient('wss://kaiehome-style-diffusion.hf.space/queue/join');
    client.connect();
    setWsClient(client);

    // 设置消息处理器
    client.onMessage((data) => {
      console.log('Received message:', data);
      if (data.type === 'progress') {
        setProgress(data.progress * 100);
      } else if (data.type === 'result') {
        setGeneratedImages(data.images);
        setIsGenerating(false);
        setProgress(100);
      } else if (data.type === 'error') {
        setError(data.message);
        setIsGenerating(false);
      }
    });

    // 清理函数
    return () => {
      client.disconnect();
    };
  }, [setGeneratedImages]);

  // 处理模板选择
  const handleTemplateSelect = (template: StyleTemplate) => {
    setSelectedTemplate(template)
    setSelectedStyle(template.id)
  }

  // 处理提示词更新（来自模板选择器的建议）
  const handlePromptUpdate = (suggestedPrompt: string) => {
    if (!prompt.trim()) {
      setPrompt(suggestedPrompt)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    if (!aspectRatio) {
      toast.error('请选择图像尺寸比例')
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setOptimizationProgress(0)
    setOptimizedPrompt('')

    try {
      let finalPrompt = prompt
      let optimizationResult: any = { prompt: finalPrompt }

      // 如果是中文输入，使用多步骤AI优化流程
      if (isChinese(prompt)) {
        setIsOptimizing(true)
        setOptimizationStep('正在启动AI优化...')
        
        try {
          // 使用选中的模板ID或默认风格
          const styleOrTemplate = selectedTemplate?.id || selectedStyle || 'default'
          
          optimizationResult = await optimizePrompt(
            prompt, 
            styleOrTemplate,
            (step: string, progress: number) => {
              setOptimizationStep(step)
              setOptimizationProgress(progress)
            }
          )
          
          finalPrompt = optimizationResult.prompt
          setOptimizedPrompt(finalPrompt)
          toast.success('AI优化完成！')
        } catch (error) {
          console.error('AI优化失败:', error)
          toast.error('AI优化失败，使用基础翻译')
          // 回退到基础翻译
          setIsTranslating(true)
          try {
            finalPrompt = await translatePrompt(prompt, selectedStyle || 'default')
            setTranslatedPrompt(finalPrompt)
          } catch (translateError) {
            console.error('翻译失败:', translateError)
            toast.error('翻译失败，使用原始提示词')
            finalPrompt = prompt
          } finally {
            setIsTranslating(false)
          }
        } finally {
          setIsOptimizing(false)
        }
      } else {
        setTranslatedPrompt('')
      }

      // 发送到图像生成API
      if (!wsClient) {
        // 如果没有WebSocket连接，直接调用AI生成函数
        try {
          const styleOrTemplate = selectedTemplate?.id || selectedStyle || 'default'
          const imageUrls = await generateImage(
            finalPrompt,
            styleOrTemplate,
            (progress: number) => {
              setProgress(progress)
            },
            service
          )
          // 将生成的图像URL数组添加到现有图像列表中
          setGeneratedImages(prev => [...prev, ...imageUrls])
          toast.success('图像生成完成！')
        } catch (error) {
          console.error('图像生成失败:', error)
          toast.error('图像生成失败，请重试')
        }
      } else {
        // 使用WebSocket发送
        wsClient.send(JSON.stringify({
          prompt: finalPrompt,
          negative_prompt: optimizationResult.negativePrompt,
          style: selectedTemplate?.id || selectedStyle || 'default',
          num_outputs: 4,
          quality: isHighQuality ? 'high' : 'basic',
          aspect_ratio: aspectRatio,
          parameters: optimizationResult.parameters
        }))
      }
    } catch (error) {
      console.error('生成失败:', error)
      toast.error('生成失败，请重试')
      setError('生成失败，请重试')
    } finally {
      setIsGenerating(false)
      setProgress(100)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-zinc-800 rounded-lg shadow-xl">
      <div className="flex justify-center mb-8 items-center gap-3">
        <Logo />
        <span className="text-2xl font-bold text-white select-none">AI图像生成器</span>
      </div>

      {/* 新增：模型选择下拉框 */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-gray-400 text-sm">模型选择：</label>
        <select
          value={service}
          onChange={e => setService(e.target.value as 'tongyi_wanxiang' | 'doubao')}
          className="bg-zinc-700 text-white rounded px-3 py-2 focus:outline-none border border-zinc-600"
        >
          <option value="tongyi_wanxiang">通义万相</option>
          <option value="doubao" disabled>豆包（即将开放）</option>
        </select>
      </div>

      {/* 风格模板选择器 */}
      <StyleTemplateSelector
        selectedTemplate={selectedTemplate?.id || null}
        onTemplateSelect={handleTemplateSelect}
        onPromptUpdate={handlePromptUpdate}
      />

      <div className="space-y-4">
        {/* 图像尺寸比例选择和质量设置 */}
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex gap-x-4">
            <div className="relative" style={{ width: '10rem' }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="appearance-none bg-zinc-700 text-gray-300 pl-12 pr-8 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full text-left"
                style={{ minWidth: '8rem', maxWidth: '12rem' }}
              >
                {aspectRatio || '图像尺寸'}
              </button>
              {/* 自定义下拉箭头 */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {/* 比例预览框 */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div 
                  className={`border-2 border-gray-400 ${
                    aspectRatio === '2:3' ? 'w-4 h-6' :
                    aspectRatio === '1:1' || !aspectRatio ? 'w-4 h-4' :
                    'w-6 h-4'
                  }`}
                />
              </div>
              {/* 下拉菜单 */}
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-zinc-700 rounded-md shadow-lg">
                  {(['2:3', '1:1', '16:9'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => {
                        setAspectRatio(ratio)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-600 flex items-center space-x-3"
                    >
                      <div 
                        className={`border-2 border-gray-400 ${
                          ratio === '2:3' ? 'w-4 h-6' :
                          ratio === '1:1' ? 'w-4 h-4' :
                          'w-6 h-4'
                        }`}
                      />
                      <span>{ratio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 图片质量开关和私人模式开关靠右 */}
          <div className="flex gap-x-2">
            <div className="relative">
              <button
                onClick={() => {
                  if (!isProUser) {
                    router.push('/pricing');
                    return;
                  }
                  setIsHighQuality(!isHighQuality)
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isHighQuality 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span>高质量</span>
              </button>
              {/* pro 徽标 */}
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs text-white font-bold px-2 py-0.5 rounded shadow-md select-none">PRO</span>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  if (!isProUser) {
                    router.push('/pricing');
                    return;
                  }
                  setIsPrivateMode(!isPrivateMode)
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isPrivateMode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span>私人模式</span>
              </button>
              {/* pro 徽标 */}
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs text-white font-bold px-2 py-0.5 rounded shadow-md select-none">PRO</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="prompt" className="block text-sm text-gray-400 mb-2">描述提示词</label>
          <SmartInput
            as="textarea"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="block w-full h-32 p-4 text-lg bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={selectedTemplate ? `试试: ${selectedTemplate.examples[0]}` : "描述您想要生成的图像..."}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500 flex items-center space-x-1">
            <span>🤖 支持中文AI智能优化</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14l-4-4h3V8h2v4h3l-4 4z"></path></svg>
          </div>
        </div>

        {/* AI优化进度显示 */}
        {isOptimizing && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-400 font-medium">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
                {optimizationStep}
              </div>
              <span className="text-xs text-blue-300">{optimizationProgress}%</span>
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              />
            </div>
            <div className="text-xs text-blue-300 mt-2">
              {selectedTemplate ? 
                `通义千问分析 → 豆包优化 → DeepSeek翻译 → ${selectedTemplate.name}模板应用` :
                '通义千问分析 → 豆包优化 → DeepSeek翻译'
              }
            </div>
          </div>
        )}

        {/* 优化结果显示 */}
        {optimizedPrompt && (
          <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">
              <span className="font-medium">✨ AI优化结果：</span>
              {selectedTemplate && (
                <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded">
                  {selectedTemplate.name}
                </span>
              )}
            </div>
            <div className="text-sm text-green-400 italic">{optimizedPrompt}</div>
          </div>
        )}

        {/* 基础翻译结果显示 */}
        {translatedPrompt && !optimizedPrompt && (
          <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">
              <span className="font-medium">🔄 基础翻译：</span>
            </div>
            <div className="text-sm text-yellow-400 italic">{translatedPrompt}</div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm mt-4">{error}</div>
        )}

        <div className="flex justify-end mt-4">
          {(isGenerating || isOptimizing) && (
            <div className="w-1/3 bg-gray-200 rounded-full h-2.5 mr-4 self-center">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(optimizationProgress * 0.3, progress)}%` }}
              />
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isGenerating || isTranslating || isOptimizing}
            className={`py-2 px-6 rounded-md text-white font-medium ${
              isGenerating || isTranslating || isOptimizing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isOptimizing ? 'AI优化中...' : 
             isGenerating ? '生成中...' : 
             isTranslating ? '翻译中...' : '生成'}
          </button>
        </div>
      </div>
    </div>
  );
}