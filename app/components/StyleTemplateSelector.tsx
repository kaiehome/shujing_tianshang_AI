'use client'
import { useState, useEffect } from 'react'
import { 
  STYLE_TEMPLATES, 
  STYLE_CATEGORIES, 
  StyleTemplate,
  getTemplatesByCategory,
  searchTemplates 
} from '../lib/style-templates'

interface StyleTemplateSelectorProps {
  selectedTemplate: string | null
  onTemplateSelect: (template: StyleTemplate) => void
  onPromptUpdate?: (prompt: string) => void
}

export default function StyleTemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect,
  onPromptUpdate 
}: StyleTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTemplates, setFilteredTemplates] = useState<StyleTemplate[]>(STYLE_TEMPLATES)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // 更新筛选结果
  useEffect(() => {
    let templates = getTemplatesByCategory(selectedCategory)
    
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery)
    }
    
    setFilteredTemplates(templates)
  }, [selectedCategory, searchQuery])

  const handleTemplateSelect = (template: StyleTemplate) => {
    onTemplateSelect(template)
    // 如果有回调函数，更新提示词输入框的占位符
    if (onPromptUpdate) {
      const examplePrompt = template.examples[0] || '描述您想要的图像...'
      onPromptUpdate(examplePrompt)
    }
  }

  const toggleDetails = (templateId: string) => {
    setShowDetails(showDetails === templateId ? null : templateId)
  }

  return (
    <div className="w-full bg-zinc-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          风格模板选择
        </h3>
        <div className="text-sm text-gray-400">
          {filteredTemplates.length} 个模板
        </div>
      </div>

      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索风格模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 pl-10 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STYLE_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`bg-zinc-700 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
              selectedTemplate === template.id
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-zinc-600 hover:border-zinc-500'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            {/* 模板预览 */}
            <div className={`h-24 bg-gradient-to-r ${template.gradient} flex items-center justify-center relative`}>
              <div className="text-white font-bold text-lg text-center px-2">
                {template.name}
              </div>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* 模板信息 */}
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {template.description}
              </p>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-zinc-600 text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-zinc-600 text-gray-400 text-xs rounded">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 参数信息 */}
              <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                <span>引导强度: {template.parameters.guidance_scale}</span>
                <span>步数: {template.parameters.num_inference_steps}</span>
              </div>

              {/* 详情按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDetails(template.id)
                }}
                className="w-full bg-zinc-600 hover:bg-zinc-500 text-gray-300 text-sm py-2 rounded transition-colors"
              >
                {showDetails === template.id ? '收起详情' : '查看详情'}
              </button>
            </div>

            {/* 详细信息展开面板 */}
            {showDetails === template.id && (
              <div className="border-t border-zinc-600 p-4 bg-zinc-750">
                <div className="space-y-3">
                  {/* 提示词模板 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">提示词模板:</h4>
                    <p className="text-xs text-gray-400 bg-zinc-800 p-2 rounded font-mono">
                      {template.promptTemplate}
                    </p>
                  </div>

                  {/* 负面提示词 */}
                  {template.negativePrompt && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">负面提示词:</h4>
                      <p className="text-xs text-gray-400 bg-zinc-800 p-2 rounded font-mono">
                        {template.negativePrompt}
                      </p>
                    </div>
                  )}

                  {/* 示例用法 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">适用场景:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.examples.map(example => (
                        <span
                          key={example}
                          className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 参数详情 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">生成参数:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-zinc-800 p-2 rounded">
                        <span className="text-gray-400">引导强度:</span>
                        <span className="text-white ml-1">{template.parameters.guidance_scale}</span>
                      </div>
                      <div className="bg-zinc-800 p-2 rounded">
                        <span className="text-gray-400">推理步数:</span>
                        <span className="text-white ml-1">{template.parameters.num_inference_steps}</span>
                      </div>
                      <div className="bg-zinc-800 p-2 rounded">
                        <span className="text-gray-400">强度:</span>
                        <span className="text-white ml-1">{template.parameters.strength}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">😔 没有找到匹配的模板</div>
          <p className="text-gray-500 text-sm">
            尝试调整搜索关键词或选择其他分类
          </p>
        </div>
      )}

      {/* 当前选中模板信息 */}
      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <span className="text-blue-400 font-medium">
                已选择: {STYLE_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </span>
              <p className="text-blue-300 text-sm mt-1">
                {STYLE_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 