import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000 // 30秒超时
})

export async function POST(request: Request) {
  try {
    const { text, mode = 'translate' } = await request.json()
    
    // 输入验证
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: '请输入要优化的内容' }, { status: 400 })
    }
    
    if (text.length > 1000) {
      return NextResponse.json({ error: '输入内容过长，请控制在1000字符以内' }, { status: 400 })
    }
    
    let systemPrompt = ''
    if (mode === 'optimize') {
      systemPrompt = `你是一个专业的AI绘画提示词润色专家。请将用户输入的中文描述润色为适合AI绘画的高质量提示词，要求：
1. 保持原意准确性
2. 使用专业的绘画术语
3. 添加适当的画质描述词（如高质量、高清、细节丰富等）
4. 结构清晰，语法正确
5. 适合Stable Diffusion等AI模型使用
6. 保持中文输出
请只返回润色后的中文提示词，不要包含任何解释或额外文字。`
    } else {
      systemPrompt = 'You are a translator'
    }
    
    // 创建超时控制的Promise
    const optimizePromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: text}
      ],
      max_tokens: 500, // 限制响应长度
      temperature: 0.7 // 控制创造性
    })
    
    // 添加额外的超时保护
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('请求超时')), 25000)
    )
    
    const response = await Promise.race([optimizePromise, timeoutPromise]) as any
    
    const result = response.choices[0].message.content?.trim()
    
    if (!result) {
      return NextResponse.json({ error: 'AI返回结果为空，请重试' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      result,
      usage: response.usage // 返回token使用情况
    })
    
  } catch (error: any) {
    console.error('AI优化错误:', error)
    
    // 根据错误类型返回不同的错误信息
    if (error.message?.includes('timeout') || error.message?.includes('超时')) {
      return NextResponse.json({ error: 'AI优化超时，请重试或简化输入内容' }, { status: 408 })
    }
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ error: 'API配额不足，请稍后重试' }, { status: 429 })
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json({ error: '请求过于频繁，请稍后重试' }, { status: 429 })
    }
    
    return NextResponse.json({ 
      error: 'AI优化服务暂时不可用，请稍后重试' 
    }, { status: 500 })
  }
}