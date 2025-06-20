import { NextResponse } from 'next/server';

const WANXIANG_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const WANXIANG_TASK_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks/';
const DOUBAO_IMAGE_API_URL = '' // TODO: 豆包生图API endpoint，待补充

// 通义万相图像生成 - 创建任务
async function createGenerationTask(prompt: string, parameters?: any, image?: File) {
  const apiKey = process.env.TONGYI_WANXIANG_API_KEY;
  if (!apiKey) {
    throw new Error('通义万相API密钥未配置');
  }

  const model = image ? 'wanx-image2text-v1' : 'wanx-v1';
  let requestBody: BodyInit;
  const headers: HeadersInit = {
    'Authorization': `Bearer ${apiKey}`,
    'X-DashScope-Async': 'enable'
  };

  if (image) {
    const formData = new FormData();
    formData.append('model', model);
    formData.append('image', image);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    requestBody = formData;
    // For multipart/form-data, the browser sets the Content-Type header automatically.
  } else {
    const payload = {
      model,
      input: {
        prompt,
        size: '1024x1024'
      },
      parameters: {
        n: 4,
        ...(parameters && Object.keys(parameters).length > 0 ? parameters : {})
      }
    };
    
    requestBody = JSON.stringify(payload);
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(WANXIANG_API_URL, {
    method: 'POST',
    headers,
    body: requestBody
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const taskId = result.output?.task_id || result.task_id;
  if (!taskId) {
    throw new Error('Failed to get task ID from API response.');
  }
  return { taskId };
}

// 查询任务状态
async function checkTaskStatus(taskId: string) {
  const apiKey = process.env.TONGYI_WANXIANG_API_KEY;
  if (!apiKey) {
    throw new Error('通义万相API密钥未配置');
  }

  try {
    const taskResponse = await fetch(`${WANXIANG_TASK_URL}${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const taskResponseText = await taskResponse.text();
    console.log('任务查询响应:', {
      status: taskResponse.status,
      body: taskResponseText
    });

    if (!taskResponse.ok) {
      throw new Error(`任务查询错误: ${taskResponse.status} - ${taskResponseText}`);
    }
    
    let taskResult;
    try {
      taskResult = JSON.parse(taskResponseText);
    } catch (e) {
      throw new Error(`无法解析任务查询响应: ${taskResponseText}`);
    }
    
    // 检查任务状态（从output.task_status或status获取）
    const taskStatus = taskResult.output?.task_status || taskResult.status;
    
    // 计算进度
    let progress = 0;
    if (taskStatus === 'PENDING') {
      progress = 0;
    } else if (taskStatus === 'RUNNING') {
      progress = 50;
    } else if (taskStatus === 'SUCCEEDED') {
      progress = 100;
    }
    
    return {
      status: taskStatus,
      progress,
      images: taskStatus === 'SUCCEEDED' && taskResult.output?.results 
        ? taskResult.output.results.map((item: any) => item.url)
        : null,
      error: taskResult.error || null
    };
  } catch (error: any) {
    console.error('查询任务状态失败:', error);
    throw error;
  }
}

// 豆包图像生成（接口结构，待补充真实API）
async function generateWithDoubaoImage(prompt: string, negativePrompt?: string, parameters?: any): Promise<string[]> {
  // TODO: 实现豆包生图API调用
  // 目前无官方endpoint，待补充
  throw new Error('豆包生图API暂未集成，请补充API文档和endpoint');
  // return [] // 保证类型
}

// API路由处理
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const taskId = formData.get('taskId') as string | null;

    if (taskId) {
      const taskStatus = await checkTaskStatus(taskId);
      return NextResponse.json(taskStatus);
    }

    const prompt = formData.get('prompt') as string;
    const parameters = JSON.parse(formData.get('parameters') as string || '{}');
    
    const images: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value);
      }
    }

    if (!prompt && images.length === 0) {
      return NextResponse.json({ error: 'Prompt or image is required.' }, { status: 400 });
    }

    // 注意：当前通义万相的API似乎主要支持单张图片作为输入。
    // 在这里，我们暂时只将第一张图片传递给API。
    // 如果需要多图融合，API和createGenerationTask函数需要进一步的逻辑支持。
    const task = await createGenerationTask(prompt, parameters, images[0] || undefined);
    return NextResponse.json(task);

  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}