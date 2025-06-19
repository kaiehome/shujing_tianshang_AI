// 移除 Deepseek API 相关代码
// const deepseek = new OpenAI({
//   apiKey: process.env.DEEPSEEK_API_KEY || 'sk-248ed291fe8148098d684c84183d4532',
//   baseURL: 'https://api.deepseek.com/v1',
//   defaultHeaders: {
//     'Content-Type': 'application/json',
//   },
// })

// 移除 translateChineseToEnglish 函数
// export async function translateChineseToEnglish(
//   chinesePrompt: string,
//   style?: string
// ): Promise<string> {
//   // 检查API密钥是否存在
//   if (!process.env.DEEPSEEK_API_KEY) {
//     console.warn('Deepseek API密钥未配置，使用模板翻译')
//     return templateTranslation(chinesePrompt, style || 'default')
//   }

//   try {
//     const systemPrompt = `你是一个专业的AI绘画提示词翻译专家。请将中文描述转换为高质量的英文AI绘画提示词。
    
// 要求：
// 1. 保持原意准确性
// 2. 使用专业的绘画术语
// 3. 添加适当的画质描述词
// 4. 结构清晰，语法正确
// 5. 适合Stable Diffusion模型使用

// ${style ? `当前选择的风格是：${style}，请根据风格调整提示词。` : ''}

// 请只返回翻译后的英文提示词，不要包含任何解释。`

//     const response = await deepseek.chat.completions.create({
//       model: "deepseek-chat",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: chinesePrompt }
//       ],
//       max_tokens: 200,
//       temperature: 0.7,
//     })

//     const translatedText = response.choices[0]?.message?.content?.trim()
//     if (!translatedText) {
//       throw new Error('翻译结果为空')
//     }

//     return translatedText
//   } catch (error) {
//     console.error('Deepseek翻译失败:', error)
//     // fallback 到模板翻译
//     return templateTranslation(chinesePrompt, style || 'default')
//   }
// }

// 保留模板翻译功能
export function templateTranslation(chinesePrompt: string, style: string = 'default'): string {
  const styleTemplates: Record<string, string> = {
    'realistic': `${chinesePrompt}, photorealistic, ultra detailed, 8k, professional photography, natural lighting`,
    'anime': `${chinesePrompt}, anime style, manga, colorful, detailed, studio quality`,
    'oil-painting': `${chinesePrompt}, oil painting, classic art style, textured brushstrokes, artistic`,
    'watercolor': `${chinesePrompt}, watercolor painting, soft colors, artistic, hand painted`,
    'sketch': `${chinesePrompt}, pencil sketch, hand drawn, artistic, detailed linework`,
    'cyberpunk': `${chinesePrompt}, cyberpunk style, neon lights, futuristic, digital art, sci-fi`,
    'fantasy': `${chinesePrompt}, fantasy art, magical, epic, detailed, concept art`,
    'portrait': `${chinesePrompt}, portrait photography, detailed face, professional lighting, high quality`,
    'landscape': `${chinesePrompt}, landscape photography, natural beauty, wide shot, detailed`,
    'abstract': `${chinesePrompt}, abstract art, artistic, creative, modern art style`,
    'default': `${chinesePrompt}, high quality, detailed, masterpiece, beautiful`
  }
  
  return styleTemplates[style] || styleTemplates.default
}

// 检测是否包含中文字符
export function isChinese(text: string): boolean {
  const chineseRegex = /[\u4e00-\u9fff]/
  return chineseRegex.test(text)
}

// 基础翻译函数（简化版本）
export async function translatePrompt(chinesePrompt: string, style: string = 'default'): Promise<string> {
  // 这里可以集成真实的翻译API，目前返回简单的英文转换
  const basicTranslation = chinesePrompt
    .replace(/美丽|漂亮/g, 'beautiful')
    .replace(/风景|景色/g, 'landscape')
    .replace(/人物|人像/g, 'portrait')
    .replace(/动物/g, 'animal')
    .replace(/花朵|花/g, 'flower')
    .replace(/城市/g, 'city')
    .replace(/夜晚|夜景/g, 'night')
    .replace(/日出|日落/g, 'sunset')
    .replace(/森林/g, 'forest')
    .replace(/海洋|大海/g, 'ocean')
  
  return `${basicTranslation}, high quality, detailed, ${style} style`
}

// 同步版本的翻译函数（用于不支持异步的场景）
export function translatePromptSync(chinesePrompt: string, style: string = 'default'): string {
  if (isChinese(chinesePrompt)) {
    return templateTranslation(chinesePrompt, style)
  }
  return chinesePrompt
}

// 不安全的做法（已导致错误）
// import { OpenAI } from 'openai'
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 安全做法：通过API路由处理
export async function translateText(text: string) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  })
  return response.json()
}