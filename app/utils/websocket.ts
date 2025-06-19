// Hugging Face Space WebSocket 客户端
export class HuggingFaceSpaceClient {
  private ws: WebSocket | null = null
  private url: string
  private sessionId: string
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private isConnected: boolean = false

  constructor(spaceUrl: string = 'wss://kaiehome-style-diffusion.hf.space/queue/join') {
    this.url = spaceUrl
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)
        
        this.ws.onopen = () => {
          console.log('Hugging Face Space WebSocket 连接已建立')
          this.isConnected = true
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('解析 WebSocket 消息失败:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('Hugging Face Space WebSocket 连接已关闭')
          this.isConnected = false
        }

        this.ws.onerror = (error) => {
          console.error('Hugging Face Space WebSocket 错误:', error)
          this.isConnected = false
          reject(error)
        }

      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(data: any) {
    console.log('收到 HF Space 消息:', data)
    
    // 处理不同类型的消息
    switch (data.msg) {
      case 'send_hash':
        // 发送会话哈希
        this.send({
          fn_index: 0,
          session_hash: this.sessionId
        })
        break
        
      case 'estimation':
        // 队列估计
        if (this.messageHandlers.has('queue_update')) {
          this.messageHandlers.get('queue_update')!({
            type: 'queue_update',
            position: data.rank,
            estimated_time: data.rank_eta
          })
        }
        break
        
      case 'process_starts':
        // 开始处理
        if (this.messageHandlers.has('process_start')) {
          this.messageHandlers.get('process_start')!({
            type: 'process_start'
          })
        }
        break
        
      case 'process_generating':
        // 生成进行中
        if (this.messageHandlers.has('progress')) {
          this.messageHandlers.get('progress')!({
            type: 'progress',
            progress: data.progress || 0
          })
        }
        break
        
      case 'process_completed':
        // 生成完成
        if (data.output && this.messageHandlers.has('result')) {
          this.messageHandlers.get('result')!({
            type: 'result',
            images: data.output.data || []
          })
        }
        break
        
      case 'process_error':
        // 生成错误
        if (this.messageHandlers.has('error')) {
          this.messageHandlers.get('error')!({
            type: 'error',
            message: data.error || '生成过程中发生错误'
          })
        }
        break
    }
  }

  // 生成图像
  generateImage(
    prompt: string, 
    negativePrompt: string = 'low quality, blurry, distorted, bad anatomy, worst quality',
    options: {
      guidance_scale?: number
      num_inference_steps?: number
      width?: number
      height?: number
      seed?: number
      num_outputs?: number
    } = {}
  ): void {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket 未连接')
    }

    const requestData = {
      data: [
        prompt,
        negativePrompt,
        options.guidance_scale || 7.5,
        options.num_inference_steps || 28,
        options.width || 1024,
        options.height || 1024,
        options.seed || -1,
        options.num_outputs || 4
      ],
      event_data: null,
      fn_index: 0,
      session_hash: this.sessionId
    }

    console.log('发送图像生成请求到 HF Space:', requestData)
    this.send(requestData)
  }

  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.error('WebSocket 未连接，无法发送消息')
    }
  }

  // 设置消息处理器
  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler)
  }

  // 移除消息处理器
  offMessage(type: string): void {
    this.messageHandlers.delete(type)
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
    this.messageHandlers.clear()
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

// 保持原有的 WebSocketClient 类以向后兼容
export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private messageHandlers: ((data: any) => void)[] = []

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    this.ws = new WebSocket(this.url)
    
    this.ws.onopen = () => {
      console.log('WebSocket 连接已建立')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.messageHandlers.forEach(handler => handler(data))
      } catch (error) {
        console.error('解析消息失败:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket 连接已关闭')
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error)
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  onMessage(handler: (data: any) => void): void {
    this.messageHandlers.push(handler)
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers = []
  }
} 