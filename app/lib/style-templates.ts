// 风格模板配置
export interface StyleTemplate {
  id: string
  name: string
  description: string
  category: string
  gradient: string
  preview?: string
  promptTemplate: string
  negativePrompt?: string
  parameters: {
    guidance_scale?: number
    num_inference_steps?: number
    strength?: number
    scheduler?: string
  }
  tags: string[]
  examples: string[]
}

export const STYLE_CATEGORIES = [
  { id: 'all', name: '全部风格', icon: '🎨' },
  { id: 'realistic', name: '写实风格', icon: '📸' },
  { id: 'artistic', name: '艺术风格', icon: '🖼️' },
  { id: 'anime', name: '动漫风格', icon: '🎭' },
  { id: 'portrait', name: '人像风格', icon: '👤' },
  { id: 'landscape', name: '风景风格', icon: '🏔️' },
  { id: 'abstract', name: '抽象风格', icon: '🌀' },
  { id: 'vintage', name: '复古风格', icon: '📻' },
  { id: 'futuristic', name: '未来风格', icon: '🚀' }
] as const

export const STYLE_TEMPLATES: StyleTemplate[] = [
  // 写实风格
  {
    id: 'photorealistic',
    name: '超写实摄影',
    description: '极致逼真的摄影效果，细节丰富',
    category: 'realistic',
    gradient: 'from-gray-600 to-gray-800',
    promptTemplate: '{prompt}, photorealistic, ultra detailed, 8k resolution, professional photography, sharp focus, natural lighting, high dynamic range',
    negativePrompt: 'cartoon, anime, painting, drawing, sketch, low quality, blurry, distorted',
    parameters: {
      guidance_scale: 7.5,
      num_inference_steps: 50,
      strength: 0.8
    },
    tags: ['写实', '摄影', '高清', '专业'],
    examples: ['城市街景', '人物肖像', '自然风光', '建筑摄影']
  },
  {
    id: 'cinematic',
    name: '电影级画质',
    description: '电影般的视觉效果和光影',
    category: 'realistic',
    gradient: 'from-blue-600 to-purple-700',
    promptTemplate: '{prompt}, cinematic lighting, dramatic composition, film grain, color grading, professional cinematography, 35mm lens, depth of field',
    negativePrompt: 'amateur, low quality, overexposed, underexposed',
    parameters: {
      guidance_scale: 8.0,
      num_inference_steps: 60,
      strength: 0.85
    },
    tags: ['电影', '戏剧性', '专业', '光影'],
    examples: ['电影场景', '戏剧人像', '史诗风景', '动作场面']
  },
  
  // 艺术风格
  {
    id: 'oil-painting',
    name: '古典油画',
    description: '传统油画的质感和色彩',
    category: 'artistic',
    gradient: 'from-amber-600 to-orange-700',
    promptTemplate: '{prompt}, oil painting, classical art style, rich textures, impasto technique, renaissance style, masterpiece quality, museum piece',
    negativePrompt: 'digital, modern, photograph, cartoon',
    parameters: {
      guidance_scale: 7.0,
      num_inference_steps: 45,
      strength: 0.9
    },
    tags: ['油画', '古典', '艺术', '质感'],
    examples: ['古典人像', '静物画', '风景油画', '宗教题材']
  },
  {
    id: 'watercolor',
    name: '水彩艺术',
    description: '柔和透明的水彩画效果',
    category: 'artistic',
    gradient: 'from-cyan-400 to-blue-500',
    promptTemplate: '{prompt}, watercolor painting, soft brushstrokes, transparent layers, flowing colors, artistic paper texture, delicate details',
    negativePrompt: 'harsh lines, digital, photorealistic, dark colors',
    parameters: {
      guidance_scale: 6.5,
      num_inference_steps: 40,
      strength: 0.75
    },
    tags: ['水彩', '柔和', '透明', '艺术'],
    examples: ['花卉水彩', '风景水彩', '人物水彩', '抽象水彩']
  },
  {
    id: 'impressionist',
    name: '印象派',
    description: '印象派绘画风格，光影变化丰富',
    category: 'artistic',
    gradient: 'from-yellow-400 to-pink-500',
    promptTemplate: '{prompt}, impressionist painting, loose brushstrokes, vibrant colors, light and shadow play, plein air style, monet style, renoir style',
    negativePrompt: 'detailed, sharp, photorealistic, dark',
    parameters: {
      guidance_scale: 7.0,
      num_inference_steps: 45,
      strength: 0.8
    },
    tags: ['印象派', '光影', '色彩', '经典'],
    examples: ['花园景色', '日出日落', '街景印象', '人物印象']
  },
  
  // 动漫风格
  {
    id: 'anime-studio',
    name: '动画工作室',
    description: '高质量动画工作室风格',
    category: 'anime',
    gradient: 'from-pink-500 to-purple-600',
    promptTemplate: '{prompt}, anime style, studio quality, cel shading, vibrant colors, detailed character design, professional animation, clean lines',
    negativePrompt: 'realistic, photograph, western cartoon, low quality',
    parameters: {
      guidance_scale: 7.5,
      num_inference_steps: 50,
      strength: 0.85
    },
    tags: ['动漫', '工作室', '高质量', '角色'],
    examples: ['动漫角色', '场景设计', '机甲设计', '魔法场景']
  },
  {
    id: 'manga',
    name: '漫画风格',
    description: '日式漫画的黑白线条风格',
    category: 'anime',
    gradient: 'from-gray-400 to-gray-600',
    promptTemplate: '{prompt}, manga style, black and white, detailed line art, screen tones, dramatic composition, japanese comic style',
    negativePrompt: 'color, realistic, photograph, western style',
    parameters: {
      guidance_scale: 6.5,
      num_inference_steps: 40,
      strength: 0.8
    },
    tags: ['漫画', '黑白', '线条', '日式'],
    examples: ['漫画人物', '动作场面', '表情特写', '背景设计']
  },
  
  // 人像风格
  {
    id: 'portrait-professional',
    name: '专业人像',
    description: '专业摄影师级别的人像效果',
    category: 'portrait',
    gradient: 'from-rose-500 to-pink-600',
    promptTemplate: '{prompt}, professional portrait photography, studio lighting, shallow depth of field, 85mm lens, perfect skin, detailed eyes, high resolution',
    negativePrompt: 'amateur, low quality, distorted face, bad anatomy',
    parameters: {
      guidance_scale: 8.0,
      num_inference_steps: 55,
      strength: 0.9
    },
    tags: ['人像', '专业', '摄影', '细节'],
    examples: ['商务头像', '艺术人像', '时尚人像', '家庭照片']
  },
  {
    id: 'portrait-artistic',
    name: '艺术人像',
    description: '富有艺术感的人像创作',
    category: 'portrait',
    gradient: 'from-purple-500 to-indigo-600',
    promptTemplate: '{prompt}, artistic portrait, creative lighting, unique composition, expressive mood, fine art photography, emotional depth',
    negativePrompt: 'commercial, generic, low quality, distorted',
    parameters: {
      guidance_scale: 7.5,
      num_inference_steps: 50,
      strength: 0.85
    },
    tags: ['艺术', '创意', '情感', '独特'],
    examples: ['情绪人像', '创意构图', '光影人像', '概念人像']
  },
  
  // 风景风格
  {
    id: 'landscape-epic',
    name: '史诗风景',
    description: '壮观震撼的自然风景',
    category: 'landscape',
    gradient: 'from-green-500 to-blue-600',
    promptTemplate: '{prompt}, epic landscape, dramatic sky, golden hour lighting, vast scale, breathtaking view, national geographic style, ultra wide angle',
    negativePrompt: 'urban, indoor, portrait, close-up',
    parameters: {
      guidance_scale: 7.0,
      num_inference_steps: 45,
      strength: 0.8
    },
    tags: ['风景', '史诗', '自然', '壮观'],
    examples: ['山脉全景', '海岸风光', '森林深处', '沙漠奇观']
  },
  {
    id: 'landscape-serene',
    name: '宁静风景',
    description: '平静祥和的自然场景',
    category: 'landscape',
    gradient: 'from-teal-400 to-green-500',
    promptTemplate: '{prompt}, serene landscape, peaceful atmosphere, soft lighting, calm colors, tranquil scene, minimalist composition',
    negativePrompt: 'dramatic, chaotic, urban, dark',
    parameters: {
      guidance_scale: 6.5,
      num_inference_steps: 40,
      strength: 0.75
    },
    tags: ['宁静', '平和', '简约', '舒缓'],
    examples: ['湖泊倒影', '田园风光', '禅意花园', '晨雾山谷']
  },
  
  // 抽象风格
  {
    id: 'abstract-modern',
    name: '现代抽象',
    description: '现代抽象艺术风格',
    category: 'abstract',
    gradient: 'from-red-500 to-yellow-500',
    promptTemplate: '{prompt}, modern abstract art, geometric shapes, bold colors, contemporary style, artistic composition, museum quality',
    negativePrompt: 'realistic, figurative, traditional, photographic',
    parameters: {
      guidance_scale: 6.0,
      num_inference_steps: 35,
      strength: 0.7
    },
    tags: ['抽象', '现代', '几何', '当代'],
    examples: ['几何构成', '色彩抽象', '线条艺术', '形状组合']
  },
  
  // 复古风格
  {
    id: 'vintage-film',
    name: '复古胶片',
    description: '怀旧的胶片摄影效果',
    category: 'vintage',
    gradient: 'from-yellow-600 to-orange-600',
    promptTemplate: '{prompt}, vintage film photography, retro colors, film grain, nostalgic mood, 70s aesthetic, warm tones, analog camera',
    negativePrompt: 'digital, modern, sharp, cold colors',
    parameters: {
      guidance_scale: 7.0,
      num_inference_steps: 45,
      strength: 0.8
    },
    tags: ['复古', '胶片', '怀旧', '温暖'],
    examples: ['复古人像', '老式汽车', '怀旧街景', '复古时尚']
  },
  
  // 未来风格
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来科技感的赛博朋克风格',
    category: 'futuristic',
    gradient: 'from-cyan-500 to-purple-600',
    promptTemplate: '{prompt}, cyberpunk style, neon lights, futuristic cityscape, high tech, dystopian atmosphere, digital art, sci-fi aesthetic',
    negativePrompt: 'natural, vintage, traditional, low tech',
    parameters: {
      guidance_scale: 8.0,
      num_inference_steps: 55,
      strength: 0.9
    },
    tags: ['赛博朋克', '未来', '科技', '霓虹'],
    examples: ['未来城市', '机械角色', '霓虹街道', '科技装备']
  },
  // 新增 非遗--蜀锦蜀绣
  {
    id: 'shujin-shuxiu',
    name: '非遗--蜀锦蜀绣',
    description: '中国非物质文化遗产，蜀锦蜀绣风格，融合传统织锦与刺绣艺术，色彩华丽，图案精美，富有东方美学。',
    category: 'artistic',
    gradient: 'from-yellow-300 to-red-500',
    promptTemplate: '{prompt}, Shu brocade and Shu embroidery style, traditional Chinese textile art, intricate patterns, vibrant colors, silk texture, oriental aesthetics, heritage craftsmanship',
    negativePrompt: 'modern, western, low quality, cartoon',
    parameters: {
      guidance_scale: 7.5,
      num_inference_steps: 48,
      strength: 0.85
    },
    tags: ['非遗', '蜀锦', '蜀绣', '中国传统', '刺绣', '织锦', '东方美学'],
    examples: ['锦绣花鸟', '传统吉祥图案', '龙凤呈祥', '中国风装饰画']
  }
]

// 根据分类筛选模板
export function getTemplatesByCategory(category: string): StyleTemplate[] {
  if (category === 'all') {
    return STYLE_TEMPLATES
  }
  return STYLE_TEMPLATES.filter(template => template.category === category)
}

// 根据ID获取模板
export function getTemplateById(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find(template => template.id === id)
}

// 搜索模板
export function searchTemplates(query: string): StyleTemplate[] {
  const lowercaseQuery = query.toLowerCase()
  return STYLE_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
} 