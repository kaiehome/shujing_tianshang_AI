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
import { useAuth } from './hooks/useAuth'
import { useImageManager } from './hooks/useImageManager'
import Image from 'next/image'
import GenerationForm from './components/GenerationForm'
import ImagePreviewPanel from './components/ImagePreviewPanel'
import StylePresets from './components/StylePresets'
// import MyGallery from './components/MyGallery' // 可后续弹窗或独立页

interface PageState {
  showRegistrationHint: boolean
  showTopSections: boolean
}

interface GenerationParams {
  aspectRatio: string;
  quality: string;
  styleStrength: number;
  resolution: string;
  lighting: string;
  mood: string;
}

export default function Home() {
  const { t, locale: currentLocale } = useTranslations()
  const router = useRouter()
  const { isAuthenticated, isVip } = useAuth()
  const { isGuestMode } = useGuest()
  const { images, isGenerating } = useImageManager()

  const [state, setState] = useState<PageState>({
    showRegistrationHint: false,
    showTopSections: true
  })

  const [selectedCategory, setSelectedCategory] = useState(stylePresets[0].category)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null)
  const [prompt, setPrompt] = useState('')
  const [promptPlaceholder, setPromptPlaceholder] = useState('请在这里输入您的创意点子...')
  const [params, setParams] = useState<GenerationParams>({
    aspectRatio: '1:1',
    quality: 'standard',
    styleStrength: 0.7,
    resolution: '768x768',
    lighting: '',
    mood: ''
  })
  
  const [generatedImages, setGeneratedImages] = useState<ImageData[]>([])
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [showGenerationSteps, setShowGenerationSteps] = useState(false)
  const [isLocalGenerating, setIsLocalGenerating] = useState(false) // 本地生成状态

  // 访客模式相关状态
  const {
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
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
    setSelectedStyle(null)
    setSelectedStyleIndex(null)
    const preset = stylePresets.find(p => p.category === category)
    if (preset && preset.styles.length > 0) {
      setPromptPlaceholder(preset.styles[0].prompt_zh)
    } else {
      setPromptPlaceholder("请在这里输入您的创意点子...")
    }
  }

  // 处理风格选择
  const handleSelect = (prompt: string, idx: number) => {
    setSelectedStyleIndex(idx)
    setSelectedStyle(prompt)
    setPromptPlaceholder(prompt)
    setPrompt('') // 清空用户输入的提示词
    
    // 滚动到提示词输入区域
    setTimeout(() => {
      scrollToSection('prompt-input-section')
    }, 100)
  }

  // 智能注册引导逻辑
  const shouldShowRegistrationHint = !isAuthenticated && !isGuestMode && images.length > 0

  // 监听用户参与度变化，智能显示注册提示
  useEffect(() => {
    if (shouldShowRegistrationHint) {
      setState(prev => ({ ...prev, showRegistrationHint: true }))
    }
  }, [shouldShowRegistrationHint])

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
    if (isGenerating || isLocalGenerating) return
    
    // 立即设置生成状态和显示进度
    setIsLocalGenerating(true)
    setShowGenerationSteps(true)
    setCurrentGenerationStep(0)
    setGenerationProgress(0)
    setGenerationError(null)
    
    // 立即滚动到进度区域
    setTimeout(() => {
      const progressSection = document.getElementById('generation-progress-section');
      if (progressSection) {
        // 使用自定义滚动，确保有足够的顶部间距
        const elementPosition = progressSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 120; // 120px的顶部间距
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    try {
      const finalPrompt = prompt.trim() || promptPlaceholder
      
      // 第一步：准备创作 - 模拟准备过程
      setCurrentGenerationStep(0)
      for (let i = 0; i <= 100; i += 20) {
        setGenerationProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // 第二步：理解需求 - 模拟分析过程
      setCurrentGenerationStep(1)
      setGenerationProgress(0)
      for (let i = 0; i <= 100; i += 25) {
        setGenerationProgress(i)
        await new Promise(resolve => setTimeout(resolve, 150))
      }
      
      // 第三步：AI绘画中 - 真实的生成过程
      setCurrentGenerationStep(2)
      setGenerationProgress(0)
      
      const formData = new FormData()
      formData.append('prompt', finalPrompt)
      
      // 恢复参数功能，现在API已经修复
      const categoryId = stylePresets.find(p => p.category === selectedCategory)?.id || '<auto>';
      
      // 移除resolution和aspectRatio，保留其他用户设置的参数
      const { resolution, aspectRatio, ...otherParams } = params;

      const paramsToPass = {
        ...otherParams,
        style: categoryId,
      }
      formData.append('parameters', JSON.stringify(paramsToPass))

      // 添加所有上传的图片
      uploadedFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })
      
      // 创建生成任务
      const createResponse = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.error || '生成失败');
      }

      const { taskId } = await createResponse.json();
      
      // 轮询任务状态
      let retries = 0;
      const maxRetries = 30; // 最多等待90秒
      
      while (retries < maxRetries) {
        const statusFormData = new FormData()
        statusFormData.append('taskId', taskId)
        
        const statusResponse = await fetch('/api/generate', {
          method: 'POST',
          body: statusFormData,
        });

        if (!statusResponse.ok) {
          const error = await statusResponse.json();
          throw new Error(error.error || '查询任务状态失败');
        }

        const { status, progress, images, error } = await statusResponse.json();
        
        if (error) {
          throw new Error(error);
        }

        // 更平滑的进度更新
        setGenerationProgress(Math.max(progress, 10)); // 确保至少显示10%进度

        if (status === 'SUCCEEDED' && images) {
          // 第四步：作品呈现 - 模拟完成过程
          setCurrentGenerationStep(3)
          for (let i = 0; i <= 100; i += 33) {
            setGenerationProgress(i)
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          // 将URL数组转换为ImageData数组
          const imageData: ImageData[] = images.map((url: string, index: number) => ({
            id: `img-${Date.now()}-${index}`,
            url,
            timestamp: Date.now() + index,
            prompt: finalPrompt,
            style: selectedCategory,
            batchId: `batch-${Date.now()}`
          }));
          
          setGeneratedImages(imageData);
          
          // 使用 incrementGeneration 减少剩余次数
          incrementGeneration(finalPrompt);
          
          // 显示成功提示
          toast.success('🎉 图像生成成功！', {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          });
          
          // 延迟隐藏进度条，让用户看到完成状态
          setTimeout(() => {
            setShowGenerationSteps(false)
            setIsLocalGenerating(false)
          }, 2000);
          
          // 滚动到结果区域
          setTimeout(() => {
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1000);
          
          return;
        } else if (status === 'FAILED') {
          throw new Error('生成失败');
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
        retries++;
      }
      
      throw new Error('生成超时，请重试');
    } catch (error: any) {
      console.error('生成失败:', error);
      setGenerationError(error.message);
      setIsLocalGenerating(false);
      
      toast.error(error.message || '生成失败，请重试', {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
    }
  };

  // 改进的引导注册处理函数
  const handleDownloadAttempt = () => {
    if (isGuestMode) {
      setModalTrigger('download_attempt')
      setShowRegistrationModal(true)
    } else {
      // 已注册用户直接下载
      handleActualDownload()
    }
  }

  const handleSaveAttempt = () => {
    if (isGuestMode) {
      setModalTrigger('save_attempt')
      setShowRegistrationModal(true)
    } else {
      // 已注册用户直接保存
      handleActualSave()
    }
  }

  const handleEditAttempt = () => {
    if (isGuestMode) {
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
  const handleImageUpload = (file: File) => {
    if (uploadedFiles.length >= 3) {
      toast.error('最多只能上传3张图片');
      return;
    }
    const newFiles = [...uploadedFiles, file];
    setUploadedFiles(newFiles);

    const newPreviews = [...imagePreviews, URL.createObjectURL(file)];
    setImagePreviews(newPreviews);
  }

  // 处理图片移除
  const handleRemoveImage = (index: number) => {
    // 从文件列表中移除
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    // 从预览列表中移除并释放内存
    const newPreviews = imagePreviews.filter((_, i) => {
      if (i === index) {
        URL.revokeObjectURL(imagePreviews[i]);
        return false;
      }
      return true;
    });
    setImagePreviews(newPreviews);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-6xl mx-auto w-full pt-0 pb-8 px-4">
        {/* Hero Section - 主标题区 */}
        {state.showTopSections && (
          <>
            <section className="flex flex-col items-center justify-center text-center mb-8" id="hero-section">
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
              <p className="text-lg md:text-xl text-yellow-400 font-medium drop-shadow-[0_3px_8px_rgba(255,215,0,0.3)] mb-6">
                {t.home.heroSlogan}
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                {t.home.heroDescription}
              </p>
            </section>

            {/* Step 1: Role Selection */}
            <div id="role-section" className="py-6">
              <div className="flex items-center mb-6">
                <div className="bg-orange-500 w-2 h-8 rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-white">
                  <span className="text-orange-400">第一步:</span> 选择一个角色
                </h2>
              </div>
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 shadow-2xl shadow-black/20">
                <StyleCategoryTabs
                  categories={stylePresets.map(p => p.category)}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
                {(() => {
                  const categoryData = stylePresets.find(p => p.category === selectedCategory);
                  if (!categoryData) return null;

                  return (
                    <div className="mt-6 p-4 bg-zinc-800/60 border border-zinc-700/80 rounded-2xl animate-fade-in-down shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-3xl shadow-inner">
                          {categoryData.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base text-gray-400">您当前选择的角色:</h3>
                          <p className="text-base font-bold text-white mb-2">{categoryData.category}</p>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            {categoryData.description}
                          </p>
                          <a href="#style-section" onClick={(e) => { e.preventDefault(); scrollToSection('style-section'); }}
                             className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                            共有 {categoryData.styles.length} 种专业风格可选
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Step 2: Style Selection */}
            <div id="style-section" className="py-12 scroll-mt-40">
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 w-2 h-8 rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-white">
                  <span className="text-blue-400">第二步:</span> 选择一个风格
                </h2>
              </div>
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 shadow-2xl shadow-black/20">
                <StyleCardGrid
                  styles={stylePresets.find(p => p.category === selectedCategory)?.styles || []}
                  onSelect={handleSelect}
                  selectedIndex={selectedStyleIndex}
                />
              </div>
            </div>

            {/* Step 3: Prompt Input */}
            <div id="prompt-input-section" className="py-12 scroll-mt-40">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 w-2 h-8 rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-white">
                  <span className="text-green-400">第三步:</span> 输入你的提示词
                </h2>
              </div>
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 shadow-2xl shadow-black/20">
                <PromptPanelV2
                  prompt={prompt}
                  onChange={setPrompt}
                  placeholder={promptPlaceholder}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating || isLocalGenerating}
                  remainingGenerations={remainingGenerations}
                  maxDailyGenerations={maxDailyGenerations}
                  canGenerate={canGenerate}
                  isAuthenticated={isAuthenticated}
                  isVip={isVip}
                  params={params}
                  setParams={setParams}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={handleRemoveImage}
                  imagePreviews={imagePreviews}
                />
              </div>
            </div>
          </>
        )}

        {/* 生成进度区域 - 独立显示，更显眼 */}
        {showGenerationSteps && (
          <section className="mb-8" id="generation-progress-section">
            <GenerationStepsProgress
              isVisible={showGenerationSteps}
              currentStep={currentGenerationStep}
              steps={DEFAULT_GENERATION_STEPS}
              progress={generationProgress}
              error={generationError}
            />
          </section>
        )}

        {/* Results Section - 生成结果区 */}
        {(generatedImages.length > 0 || isGenerating || isLocalGenerating) && (
          <section className="mb-8" id="results-section">
            <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">{t.home.generateResults}</h2>
                {isGuestMode && (
                  <span className="text-sm text-orange-400 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/20">
                    {t.home.guestMode}
                  </span>
                )}
              </div>
              
              <ImageResultGallery 
                images={generatedImages} 
                isGenerating={isGenerating || isLocalGenerating}
                isGuest={isGuestMode}
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
        {process.env.NODE_ENV === 'development' && isGuestMode && (
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
