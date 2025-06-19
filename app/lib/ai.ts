import { translatePrompt, Style } from './prompts'
import { StyleTemplate, getTemplateById } from './style-templates'

// 大模型配置
const MODEL_CONFIGS = {
  tongyi: {
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    apiKey: process.env.TONGYI_API_KEY || 'sk-ade7e6a1728741fcb009dcf1419000de',
    model: 'qwen-plus'
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-248ed291fe8148098d684c84183d4532',
    model: 'deepseek-chat'
  },
  doubao: {
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.DOUBAO_API_KEY || '7f11c50c-456b-46d1-aa7f-bf13b66fc17a',
    model: 'doubao-1-5-pro-32k-250115'
  }
} as const

type ModelType = keyof typeof MODEL_CONFIGS

// 通用API调用函数
async function callLLMAPI(
  modelType: ModelType,
  messages: Array<{ role: string; content: string }>,
  timeout: number = 30000
): Promise<string> {
  const config = MODEL_CONFIGS[modelType]
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`${modelType} API请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(`${modelType} API请求超时`)
    }
    throw error
  }
}

// DeepSeek：分析结构，提取主题/情绪/风格关键词
async function analyzeWithDeepSeek(inputText: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的文本分析师。请分析用户输入的中文描述，提取出主题、情绪和风格关键词。请用简洁的词汇列出关键要素，用逗号分隔。'
    },
    {
      role: 'user',
      content: `请分析以下描述并提取关键词：${inputText}`
    }
  ]
  return await callLLMAPI('deepseek', messages)
}

// 通义润色：优化文艺化描述
async function optimizeWithTongyi(keywords: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: '你是一个富有创意的文学创作者。请将提供的关键词转化为优美、文艺的中文描述，适合用于艺术创作。描述要生动、富有画面感。'
    },
    {
      role: 'user',
      content: `请将以下关键词优化为文艺化的描述：${keywords}`
    }
  ]
  return await callLLMAPI('tongyi', messages)
}

// DeepSeek：翻译英文并进行风格补全
async function translateWithDeepSeek(chineseDescription: string, style: Style): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的翻译和艺术指导专家。请将中文描述翻译为英文，并根据指定风格添加适当的艺术风格描述词汇，使其适合AI图像生成。'
    },
    {
      role: 'user',
      content: `请将以下中文描述翻译为英文并添加${style}风格的艺术描述：${chineseDescription}`
    }
  ]
  
  return await callLLMAPI('deepseek', messages)
}

// 应用风格模板到提示词
function applyStyleTemplate(prompt: string, template: StyleTemplate): string {
  return template.promptTemplate.replace('{prompt}', prompt)
}

// 多步骤提示词优化流程（更新版本，支持模板）
export async function optimizePrompt(
  chinesePrompt: string,
  styleOrTemplate: Style | string,
  onProgress?: (step: string, progress: number) => void
): Promise<{ prompt: string; negativePrompt?: string; parameters?: any }> {
  try {
    const template = getTemplateById(styleOrTemplate as string)
    if (template) {
      onProgress?.('正在应用风格模板...', 10)
      // 步骤1：DeepSeek分析
      onProgress?.('正在分析关键词...', 30)
      const keywords = await analyzeWithDeepSeek(chinesePrompt)
      // 步骤2：通义润色
      onProgress?.('正在润色描述...', 60)
      const optimizedDescription = await optimizeWithTongyi(keywords)
      // 步骤3：DeepSeek翻译
      onProgress?.('正在翻译并应用模板...', 80)
      const translatedPrompt = await translateWithDeepSeek(optimizedDescription, styleOrTemplate as Style)
      // 步骤4：应用风格模板
      onProgress?.('正在应用风格模板...', 90)
      const finalPrompt = applyStyleTemplate(translatedPrompt, template)
      onProgress?.('优化完成', 100)
      return {
        prompt: finalPrompt,
        negativePrompt: template.negativePrompt,
        parameters: template.parameters
      }
    } else {
      // 非模板分支
      onProgress?.('正在分析关键词...', 25)
      const keywords = await analyzeWithDeepSeek(chinesePrompt)
      onProgress?.('正在润色描述...', 50)
      const optimizedDescription = await optimizeWithTongyi(keywords)
      onProgress?.('正在翻译并补全风格...', 75)
      const finalPrompt = await translateWithDeepSeek(optimizedDescription, styleOrTemplate as Style)
      onProgress?.('优化完成', 100)
      return { prompt: finalPrompt }
    }
  } catch (error) {
    console.error('提示词优化失败:', error)
    const fallbackPrompt = await translatePrompt(chinesePrompt, styleOrTemplate as Style)
    return { prompt: fallbackPrompt }
  }
}

// 保持原有的图像生成函数，但使用优化后的提示词和参数
export async function generateImage(
  chinesePrompt: string,
  styleOrTemplate: Style | string,
  onProgress?: (progress: number) => void,
  service: 'tongyi_wanxiang' | 'doubao' = 'tongyi_wanxiang',
  uploadedImage?: File | null
): Promise<string[]> {
  try {
    // 使用多步骤优化的提示词和参数
    const optimizationResult = await optimizePrompt(chinesePrompt, styleOrTemplate, (step, progress) => {
      onProgress?.(progress * 0.3) // 优化阶段占30%进度
    })
    
    const { prompt: englishPrompt, negativePrompt, parameters } = optimizationResult
    
    onProgress?.(30) // 优化完成，开始图像生成
    
    let response: Response
    if (uploadedImage) {
      // 使用 FormData 上传图片和参数
      const formData = new FormData()
      formData.append('image', uploadedImage)
      formData.append('prompt', englishPrompt)
      if (negativePrompt) formData.append('negativePrompt', negativePrompt)
      formData.append('parameters', JSON.stringify({
        ...parameters,
        guidance_scale: parameters?.guidance_scale || 7.5,
        num_inference_steps: parameters?.num_inference_steps || 28,
        width: 1024,
        height: 1024,
        num_outputs: 4
      }))
      formData.append('service', service)
      response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      })
    } else {
      // 纯文本 JSON 请求
      response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: englishPrompt,
          negativePrompt: negativePrompt,
          parameters: {
            ...parameters,
            guidance_scale: parameters?.guidance_scale || 7.5,
            num_inference_steps: parameters?.num_inference_steps || 28,
            width: 1024,
            height: 1024,
            num_outputs: 4
          },
          service
        })
      })
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '图像生成API请求失败')
    }

    const result = await response.json()
    
    // 处理不同类型的响应
    if (result.type === 'prediction') {
      // Replicate异步生成，需要轮询状态
      return await pollReplicateStatus(result.predictionId, onProgress)
    } else if (result.type === 'images') {
      // 直接返回图像（来自 HF Space 或其他服务）
      onProgress?.(100)
      console.log(`图像生成完成，来源: ${result.source || '未知'}`)
      return result.images
    } else {
      throw new Error('未知的响应格式')
    }
    
  } catch (error) {
    console.error('图像生成失败:', error)
    throw error
  }
}

// 轮询Replicate生成状态
async function pollReplicateStatus(predictionId: string, onProgress?: (progress: number) => void): Promise<string[]> {
  const maxAttempts = 60 // 最多等待5分钟 (60 * 5秒)
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`/api/generate?id=${predictionId}`)
      
      if (!response.ok) {
        throw new Error('查询生成状态失败')
      }
      
      const status = await response.json()
      
      // 更新进度
      if (onProgress && status.progress !== undefined) {
        // 图像生成阶段占70%进度，从30%开始
        const generationProgress = 30 + (status.progress * 70)
        onProgress(Math.min(generationProgress, 100))
      }
      
      // 检查状态
      if (status.status === 'succeeded' && status.output) {
        onProgress?.(100)
        return Array.isArray(status.output) ? status.output : [status.output]
      } else if (status.status === 'failed') {
        throw new Error(status.error || '图像生成失败')
      } else if (status.status === 'canceled') {
        throw new Error('图像生成被取消')
      }
      
      // 等待5秒后再次查询
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
      
    } catch (error) {
      console.error('查询状态错误:', error)
      attempts++
      
      if (attempts >= maxAttempts) {
        throw new Error('图像生成超时或查询失败')
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  
  throw new Error('图像生成超时')
}

// 快速图像生成函数（用于演示或测试）
export async function generateImageQuick(
  prompt: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  try {
    onProgress?.(10)
    
    // 直接使用Hugging Face进行快速生成
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        service: 'huggingface' // 使用Hugging Face快速生成
      })
    })

    onProgress?.(50)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '快速图像生成失败')
    }

    const result = await response.json()
    onProgress?.(100)
    
    return result.images || []
    
  } catch (error) {
    console.error('快速图像生成失败:', error)
    throw error
  }
}

// 导出单独的优化函数供其他组件使用
export { analyzeWithDeepSeek, optimizeWithTongyi, translateWithDeepSeek }