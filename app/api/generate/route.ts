import { NextResponse } from 'next/server';

const WANXIANG_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const DOUBAO_IMAGE_API_URL = '' // TODO: 豆包生图API endpoint，待补充

// 通义万相图像生成
async function generateWithTongyiWanxiang(prompt: string, negativePrompt?: string, parameters?: any) {
  const apiKey = process.env.TONGYI_WANXIANG_API_KEY;
  if (!apiKey) {
    throw new Error('通义万相API密钥未配置');
  }
  const input: Record<string, any> = {
    prompt,
    negative_prompt: negativePrompt || '',
    n: parameters?.num_outputs || 4,
    width: parameters?.width || 1024,
    height: parameters?.height || 1024,
    seed: parameters?.seed ?? -1,
    style: parameters?.style || '',
    cfg_scale: parameters?.guidance_scale || 7.5,
    steps: parameters?.num_inference_steps || 28
  };
  Object.keys(input).forEach(key => {
    if (input[key] === '' || input[key] === undefined) {
      delete input[key];
    }
  });
  const requestBody = {
    model: parameters?.model || 'wanxiang',
    input
  };
  const response = await fetch(WANXIANG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`通义万相API错误: ${response.status} - ${errorText}`);
  }
  const result = await response.json();
  let images: string[] = [];
  if (result.output && Array.isArray(result.output.results)) {
    images = result.output.results.map((item: any) => item.url || item.image || item.base64);
  } else if (result.output && Array.isArray(result.output.images)) {
    images = result.output.images;
  }
  if (!images.length) {
    throw new Error('通义万相API未返回有效的图片数据');
  }
  return images;
}

// 豆包图像生成（接口结构，待补充真实API）
async function generateWithDoubaoImage(prompt: string, negativePrompt?: string, parameters?: any): Promise<string[]> {
  // TODO: 实现豆包生图API调用
  // 目前无官方endpoint，待补充
  throw new Error('豆包生图API暂未集成，请补充API文档和endpoint');
  // return [] // 保证类型
}

// 只保留POST方法
export async function POST(request: Request) {
  try {
    const { prompt, negativePrompt, parameters, service } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: '缺少提示词' }, { status: 400 });
    }
    let images: string[] = [];
    let source = 'tongyi_wanxiang';
    if (service === 'doubao') {
      images = await generateWithDoubaoImage(prompt, negativePrompt, parameters);
      source = 'doubao';
    } else {
      images = await generateWithTongyiWanxiang(prompt, negativePrompt, parameters);
      source = 'tongyi_wanxiang';
    }
    return NextResponse.json({
      type: 'images',
      images,
      message: '图像生成完成',
      source
    });
  } catch (error: any) {
    console.error('通义万相图像生成错误:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : '图像生成失败',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}