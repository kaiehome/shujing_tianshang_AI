// 示例：FLUX.1-Dev 的前端 WebSocket 接入模板（使用 Next.js + React）

import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SmartInput from './SmartInput'

export default function FluxImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const wsRef = useRef(null)

  const handleGenerate = () => {
    setLoading(true)
    const connectionId = uuidv4()

    const ws = new WebSocket('wss://api.stability.ai/v2beta/stable-image/generate/ws')
    wsRef.current = ws

    ws.onopen = () => {
      const payload = {
        engine_id: 'stable-diffusion-xl-1024-v1-0',
        request_id: connectionId,
        prompt: [
          {
            text: prompt,
            weight: 1
          }
        ],
        image: {
          width: 1024,
          height: 1024,
          steps: 30,
          seed: Math.floor(Math.random() * 100000),
          samples: 1,
          cfg_scale: 7.5,
        }
      }
      ws.send(JSON.stringify(payload))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.image && data.image.base64) {
        setImages(prev => [...prev, `data:image/png;base64,${data.image.base64}`])
        setLoading(false)
        ws.close()
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🧠 FLUX.1 AI 图像生成器</h1>
      <SmartInput
        as="textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="请输入提示词，如：一个穿太空服的猫"
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? '生成中...' : '生成图片'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {images.map((img, idx) => (
          <img key={idx} src={img} alt="AI生成图像" className="rounded shadow" />
        ))}
      </div>
    </div>
  )
}
