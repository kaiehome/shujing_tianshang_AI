'use client'
import FloatingActionButton from './components/FloatingActionButton'
import StyleCategoryTabs from './components/StyleCategoryTabs'
import StyleCardGrid from './components/StyleCardGrid'
import PromptPanelV2 from './components/PromptPanelV2'
import ImageResultGallery, { ImageData } from './components/ImageResultGallery'
import GenerationStepsProgress, { DEFAULT_GENERATION_STEPS } from './components/GenerationStepsProgress'
// import ImageGenerationStatus from './components/ImageGenerationStatus' // 移除图像生成服务状态组件
import RegistrationModal from './components/RegistrationModal'
import DevAntiSpamStatus from './components/DevAntiSpamStatus'
import { useState, useEffect } from 'react'
import { stylePresets } from './data/stylePresets'
import { useGuest } from './hooks/useGuest'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Logo from './components/Logo'
import { generateImage } from './lib/ai'
import { getCurrentLocale, getLocalizedPath } from './lib/i18n'
import { useTranslations } from './hooks/useTranslations'
// import MyGallery from './components/MyGallery' // 可后续弹窗或独立页

export default function Home() {
  const { t, locale: currentLocale } = useTranslations()

  const [selectedCategory, setSelectedCategory] = useState(stylePresets[0].category)
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [promptPlaceholder, setPromptPlaceholder] = useState(stylePresets[0].styles[0].prompt_zh)
  const [params, setParams] = useState({
    aspectRatio: '1:1',
    quality: 'standard',
    styleStrength: 0.7,
    resolution: '768x768',
    lighting: '',
    mood: ''
  })
  
  const [generatedImages, setGeneratedImages] = useState<ImageData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [showGenerationSteps, setShowGenerationSteps] = useState(false)
  const [showTopSections, setShowTopSections] = useState(true)

  // 访客模式相关状态
  const {
    isGuest,
    remainingGenerations,
    maxDailyGenerations,
    canGenerate,
    resetDailyLimit,
    antiSpamMessage,
    incrementGeneration
  } = useGuest()

  // 注册引导相关状态
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [modalTrigger, setModalTrigger] = useState<'limit_reached' | 'download_attempt' | 'save_attempt' | 'history_access' | 'edit_attempt'>('limit_reached')
  const [hasShownWelcomeBonus, setHasShownWelcomeBonus] = useState(false)
  const [userEngagementLevel, setUserEngagementLevel] = useState(0) // 用户参与度评分

  const router = useRouter()

  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // 滚动到指定区域的辅助函数
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const offset = 50 // 顶部偏移量，单位像素
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // 处理角色选择
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedStyleIndex(-1) // 重置风格选择
    setPrompt('') // 重置提示词
    setPromptPlaceholder('') // 重置提示词占位符
    
    // 滚动到风格选择区域
    setTimeout(() => {
      scrollToSection('style-section')
    }, 100)
  }

  // 处理风格选择
  const handleApplyStyle = (prompt: string, idx: number) => {
    setSelectedStyleIndex(idx)
    setPromptPlaceholder(prompt)
    setPrompt('') // 清空用户输入的提示词
    
    // 滚动到提示词输入区域
    setTimeout(() => {
      scrollToSection('prompt-input-section')
    }, 100)
  }

  // 智能注册引导逻辑
  const shouldShowRegistrationHint = () => {
    if (!isGuest) return false
    
    // 基于用户参与度和使用情况判断引导时机
    if (userEngagementLevel >= 3 && !hasShownWelcomeBonus) {
      return 'engagement_bonus' // 高参与度用户奖励
    }
    
    if (remainingGenerations === 1 && generatedImages.length > 0) {
      return 'last_chance' // 最后一次机会
    }
    
    if (remainingGenerations === 0) {
      return 'limit_reached' // 次数用完
    }
    
    return false
  }

  // 监听用户参与度变化，智能显示注册提示
  useEffect(() => {
    const hint = shouldShowRegistrationHint()
    if (hint === 'engagement_bonus' && !hasShownWelcomeBonus) {
      setHasShownWelcomeBonus(true)
      // 延迟显示，给用户更好的体验
      setTimeout(() => {
        setModalTrigger('engagement_bonus' as any)
        setShowRegistrationModal(true)
      }, 2000)
    }
  }, [userEngagementLevel, hasShownWelcomeBonus, isGuest])

  const simulateGenerationSteps = async () => {
    setShowGenerationSteps(true)
    setCurrentGenerationStep(0)
    setGenerationProgress(0)
    setGenerationError('')

    // 增加用户参与度
    setUserEngagementLevel(prev => prev + 2)
    
    const steps = DEFAULT_GENERATION_STEPS
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentGenerationStep(i)
      
      // 每步内的进度模拟
      for (let progress = 0; progress <= 100; progress += 20) {
        setGenerationProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  const handleGenerate = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    setShowGenerationSteps(true)
    setGenerationError(null)
    
    try {
      const finalPrompt = prompt.trim() || promptPlaceholder
      
      // 如果有上传图片，则使用第一张图片进行生成
      const imageUrls = await generateImage(
        finalPrompt,
        selectedCategory,
        (progress: number) => {
          console.log('图像生成进度:', progress)
        },
        'tongyi_wanxiang',
        uploadedImages.length > 0 ? uploadedImages[0] : undefined
      )
      
      if (imageUrls && imageUrls.length > 0) {
        // 将URL数组转换为ImageData数组
        const imageData: ImageData[] = imageUrls.map((url, index) => ({
          id: `img-${Date.now()}-${index}`,
          url,
          timestamp: Date.now() + index,
          prompt: finalPrompt,
          style: selectedCategory,
          batchId: `batch-${Date.now()}`
        }))
        
        setGeneratedImages(imageData)
        
        // 使用 incrementGeneration 减少剩余次数
        incrementGeneration(finalPrompt)
        
        // 显示成功提示
        toast.success('图像生成成功！', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        })
        
        // 滚动到结果区域
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section')
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 500)
        
      } else {
        throw new Error('生成失败，未返回图像')
      }
      
    } catch (error) {
      console.error('生成错误:', error)
      setGenerationError(error instanceof Error ? error.message : '生成失败，请重试')
      
      toast.error('图像生成失败，请重试', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      })
    } finally {
      setIsGenerating(false)
      setShowGenerationSteps(false)
      setCurrentGenerationStep(0)
      setGenerationProgress(0)
    }
  }

  // 改进的引导注册处理函数
  const handleDownloadAttempt = () => {
    if (isGuest) {
      setModalTrigger('download_attempt')
      setShowRegistrationModal(true)
    } else {
      // 已注册用户直接下载
      handleActualDownload()
    }
  }

  const handleSaveAttempt = () => {
    if (isGuest) {
      setModalTrigger('save_attempt')
      setShowRegistrationModal(true)
    } else {
      // 已注册用户直接保存
      handleActualSave()
    }
  }

  const handleEditAttempt = () => {
    if (isGuest) {
      setModalTrigger('edit_attempt')
      setShowRegistrationModal(true)
    } else {
      // 已注册用户直接编辑
      handleActualEdit()
    }
  }

  // 实际功能实现（注册后可用）
  const handleActualDownload = () => {
    toast.success('开始下载高清图像...', {
      duration: 2000,
      style: { background: '#10B981', color: 'white' }
    })
  }

  const handleActualSave = () => {
    toast.success('作品已保存到您的图库！', {
      duration: 2000,
      style: { background: '#10B981', color: 'white' }
    })
  }

  const handleActualEdit = () => {
    toast.success('进入编辑模式...', {
      duration: 2000,
      style: { background: '#10B981', color: 'white' }
    })
  }

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 转换为数组并限制最多3张图片
    const newFiles = Array.from(files).slice(0, 3 - uploadedImages.length)

    // 验证文件
    const validFiles = newFiles.filter(file => {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请只上传图片文件')
        return false
      }
      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`图片 ${file.name} 超过5MB限制`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      // 合并现有图片和新图片
      const updatedImages = [...uploadedImages, ...validFiles]
      const updatedPreviews = [
        ...imagePreviews,
        ...validFiles.map(file => URL.createObjectURL(file))
      ]
      setUploadedImages(updatedImages)
      setImagePreviews(updatedPreviews)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-6xl mx-auto w-full py-8 px-4">
        {/* Hero Section - 主标题区 */}
        {showTopSections && (
          <>
            <section className="flex flex-col items-center justify-center text-center mb-12" id="hero-section">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Artbud Logo" 
                  className="h-20 w-20 rounded-full shadow-2xl bg-white object-cover ring-4 ring-orange-500/30 animate-pulse" 
                />
                <h1
                  className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent"
                  style={{
                    fontFamily: '"造字工房言宋体", "Playfair Display", "PingFang SC", "Microsoft YaHei", serif',
                    letterSpacing: currentLocale === 'zh' ? '0.6em' : '0.2em',
                    textShadow: `
                      3px 3px 6px rgba(0,0,0,0.3),
                      6px 6px 12px rgba(0,0,0,0.15),
                      0 0 30px rgba(56, 189, 248, 0.3),
                      0 0 40px rgba(168, 85, 247, 0.2),
                      0 0 50px rgba(232, 121, 249, 0.2)
                    `,
                    WebkitTextStroke: '1px rgba(255,255,255,0.1)'
                  }}
                >
                  {t.home.heroTitle}
          </h1>
              </div>
              <p className="text-xl md:text-2xl text-yellow-400 font-medium drop-shadow-[0_3px_8px_rgba(255,215,0,0.3)] mb-6">
                {t.home.heroSlogan}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t.home.heroDescription}
              </p>
            </section>

            {/* Category Selection - 角色选择区 */}
            <section className="mb-8" id="category-section">
              <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">第一步：选择您的创作角色</h2>
                  <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">共6种角色</span>
                </div>
                <StyleCategoryTabs selected={selectedCategory} setSelected={handleCategorySelect} />
              </div>
            </section>

            {/* Style Selection - 风格选择区 */}
            <section className="mb-8" id="style-section">
              <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">第二步：选择图像风格</h2>
                  <span className="text-sm text-orange-400 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/20">
                    当前角色：{selectedCategory}
            </span>
          </div>
                <StyleCardGrid 
                  selectedCategory={selectedCategory} 
                  selectedStyleIndex={selectedStyleIndex} 
                  onApplyStyle={handleApplyStyle} 
                />
              </div>
            </section>
          </>
        )}

        {/* Input Section - 描述输入区 */}
        <section className="mb-8" id="prompt-input-section">
          <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">第三步：描述您想要的图像</h2>
              <span className="text-sm text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
                支持中文输入
              </span>
              {/* 访客状态显示 */}
              {isGuest && (
                <span className="text-sm text-orange-400 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/20">
                  访客体验 {remainingGenerations}/{maxDailyGenerations} 次生成
                </span>
              )}
        </div>

            <PromptPanelV2
              prompt={prompt}
              setPrompt={setPrompt}
              params={params}
              setParams={setParams}
              promptPlaceholder={promptPlaceholder}
            />
            
            {/* 图生图上传区 */}
            <div className="mt-6 mb-4">
              <label className="block text-sm text-gray-400 mb-2">可选：上传图片进行图生图（Image-to-Image），最多3张</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-all"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  type="button"
                  disabled={uploadedImages.length >= 3}
                >
                  上传图片
                </button>
                <div className="flex gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`预览 ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-zinc-600" />
                      <button
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        onClick={() => {
                          const newImages = [...uploadedImages];
                          const newPreviews = [...imagePreviews];
                          newImages.splice(index, 1);
                          newPreviews.splice(index, 1);
                          setUploadedImages(newImages);
                          setImagePreviews(newPreviews);
                        }}
                        type="button"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                支持JPG/PNG，每张最大5MB。已上传 {uploadedImages.length}/3 张
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                {/* 移除AI智能优化开关，因为已经有步骤进度显示 */}
        </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && (!promptPlaceholder || promptPlaceholder === '您想看到什么？')) || !canGenerate}
                className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2 ${
                  !canGenerate 
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white'
                }`}
                title={!canGenerate ? '今日试用次数已用完，注册即可继续使用' : ''}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    生成中...
                  </>
                ) : !canGenerate ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    次数已用完
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



            {/* 访客限制提示 */}
            {isGuest && remainingGenerations <= 1 && remainingGenerations > 0 && (
              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                  <span className="text-orange-400 text-sm">
                    {t.home.guestLimitNotice.replace('{count}', remainingGenerations.toString())}
                    <button 
                      onClick={() => router.push(getLocalizedPath('/login', currentLocale))}
                      className="underline hover:text-orange-300 ml-1"
                    >
                      {t.home.registerForPoints}
                    </button>
                  </span>
                </div>
                  </div>
            )}

            {/* 防刷消息提示 */}
            {antiSpamMessage && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-400 text-sm">{antiSpamMessage}</span>
                </div>
            </div>
            )}
          </div>
        </section>

        {/* Results Section - 生成结果区 */}
        {(generatedImages.length > 0 || isGenerating) && (
          <section className="mb-8" id="results-section">
            {/* 生成步骤进度 */}
            {showGenerationSteps && (
              <div className="mb-6">
                <GenerationStepsProgress
                  isVisible={showGenerationSteps}
                  currentStep={currentGenerationStep}
                  steps={DEFAULT_GENERATION_STEPS}
                  progress={generationProgress}
                  error={generationError}
                />
              </div>
            )}
            
            <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">{t.home.generateResults}</h2>
                {isGuest && (
                  <span className="text-sm text-orange-400 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/20">
                    {t.home.guestMode}
                  </span>
                )}
              </div>
              
              <ImageResultGallery 
                images={generatedImages} 
                isGenerating={isGenerating}
                isGuest={isGuest}
                onDownloadAttempt={handleDownloadAttempt}
                onSaveAttempt={handleSaveAttempt}
                onEditAttempt={handleEditAttempt}
              />
            </div>
          </section>
        )}

        {/* Activity Banner - 活动横幅 */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 border border-emerald-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl animate-bounce">🎁</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-blue-400 bg-clip-text text-transparent">
                {t.home.newUserBenefits}
              </h3>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* 注册奖励 */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-400/20 rounded-xl p-4">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="text-emerald-400 font-bold mb-1">{t.home.registerReward.title}</h4>
                <p className="text-2xl font-bold text-white mb-1">{t.home.registerReward.points}</p>
                <p className="text-gray-300 text-sm">{t.home.registerReward.description}</p>
              </div>
              
              {/* 免费体验 */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/20 rounded-xl p-4">
                <div className="text-3xl mb-2">🎨</div>
                <h4 className="text-blue-400 font-bold mb-1">{t.home.fullFeatures.title}</h4>
                <p className="text-2xl font-bold text-white mb-1">{t.home.fullFeatures.styles}</p>
                <p className="text-gray-300 text-sm">{t.home.fullFeatures.description}</p>
              </div>
              
              {/* 高清下载 */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-400/20 rounded-xl p-4">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="text-purple-400 font-bold mb-1">{t.home.hdDownload.title}</h4>
                <p className="text-2xl font-bold text-white mb-1">{t.home.hdDownload.free}</p>
                <p className="text-gray-300 text-sm">{t.home.hdDownload.description}</p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push(getLocalizedPath('/login', currentLocale))}
              className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-purple-500 hover:via-blue-500 hover:to-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t.home.registerButton}
            </button>
          </div>
        </section>

        {/* Quick Tips - 使用技巧 */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 backdrop-blur-sm rounded-xl py-6 px-6 border border-zinc-600/20">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.home.quickTips.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300">
              {t.home.quickTips.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 开发测试区域 */}
        {process.env.NODE_ENV === 'development' && isGuest && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                🧪 {t.home.devTools.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <button
                    onClick={resetDailyLimit}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded border border-yellow-500/30 transition-colors"
                  >
                    {t.home.devTools.resetButton}
                  </button>
                  <div className="text-gray-400">
                    {t.home.devTools.currentStatus
                      .replace('{remaining}', remainingGenerations.toString())
                      .replace('{total}', maxDailyGenerations.toString())}
                  </div>
                  {antiSpamMessage && (
                    <div className="text-red-400">
                      {t.home.devTools.antiSpam.replace('{message}', antiSpamMessage)}
                    </div>
                  )}
                </div>
                
                {/* 防刷状态详情 */}
                <div className="bg-black/20 rounded-lg p-3">
                  <h4 className="text-green-400 font-medium mb-2">🛡️ 防刷状态</h4>
                  <DevAntiSpamStatus />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <FloatingActionButton />

      {/* 注册引导模态框 */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        trigger={modalTrigger}
        remainingGenerations={remainingGenerations}
      />
    </div>
  )
}
