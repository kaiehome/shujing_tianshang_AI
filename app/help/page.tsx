'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

export default function Help() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)

  const helpSections = [
    {
      id: 'getting-started',
      title: '🚀 快速开始',
      icon: '🚀',
      content: [
        {
          title: '第一步：选择创作角色',
          description: '根据您的使用场景选择合适的创作角色，如"小红书|微博|抖音创作者"、"情绪疗愈|身心灵用户"等。',
          tips: ['每种角色都有对应的专业模板', '可以随时切换不同角色', '建议先从自己最熟悉的领域开始']
        },
        {
          title: '第二步：选择图像风格',
          description: '在选定角色后，浏览该角色下的各种图像风格，点击风格卡片可以预览效果。',
          tips: ['每个风格都有预览图参考', '选中的风格会显示蓝色边框', '风格会影响最终生成的图片效果']
        },
        {
          title: '第三步：输入图像描述',
          description: '用中文描述您想要的图像内容，系统会自动优化您的描述。',
          tips: ['支持纯中文输入', '描述越详细效果越好', '可以开启AI智能优化功能']
        },
        {
          title: '第四步：生成图像',
          description: '点击"立即生成"按钮，系统会一次性生成4张高质量图片供您选择。',
          tips: ['每次生成4张不同的图片', '可以下载、保存和编辑', '注册用户有更多生成次数']
        }
      ]
    },
    {
      id: 'features',
      title: '✨ 功能说明',
      icon: '✨',
      content: [
        {
          title: 'AI智能优化',
          description: '开启后系统会自动优化您的中文描述，生成更专业的英文Prompt，提升图像质量。',
          tips: ['建议新用户开启此功能', '可以学习专业的描述方式', '优化后的内容会显示在输入框下方']
        },
        {
          title: '风格参数调节',
          description: '可以调整图像尺寸、风格强度等参数，满足不同的创作需求。',
          tips: ['1:1适合头像和logo', '16:9适合横版海报', '风格强度影响风格化程度']
        },
        {
          title: '批量生成',
          description: '每次点击生成会同时创建4张不同角度的图片，提供更多选择。',
          tips: ['4张图片风格一致但细节不同', '可以分别下载喜欢的图片', '支持批量保存到个人作品集']
        },
        {
          title: '作品管理',
          description: '注册用户可以保存、分类管理生成的图片，建立个人创作档案。',
          tips: ['支持添加标签和备注', '可以重新编辑已保存的作品', '支持分享到社交平台']
        }
      ]
    },
    {
      id: 'tips',
      title: '💡 使用技巧',
      icon: '💡',
      content: [
        {
          title: '描述技巧',
          description: '好的描述是生成优质图片的关键，以下是一些实用的描述技巧。',
          tips: [
            '包含主体：明确说明图片的主要内容',
            '描述场景：说明环境、背景、氛围',
            '指定色彩：提及希望的主色调或配色',
            '添加细节：加入光线、材质、表情等细节',
            '举例：一个可爱的小女孩在樱花树下读书，温暖的夕阳光线，粉色樱花飘散，温馨治愈的氛围'
          ]
        },
        {
          title: '风格选择建议',
          description: '不同的风格适用于不同的场景，选择合适的风格能事半功倍。',
          tips: [
            '社交媒体：选择"极简ins风"或"治愈系插画"',
            '商业用途：选择"品牌插画风"或"促销图风格"',
            '教育内容：选择"板书感插画"或"可爱教学插图"',
            '个人收藏：选择"日式可爱插画"或"手绘贴纸风"'
          ]
        },
        {
          title: '参数调节指南',
          description: '合理调节参数可以获得更符合需求的图片效果。',
          tips: [
            '图像尺寸：根据使用场景选择，头像用1:1，海报用16:9',
            '风格强度：70-80%适合大多数场景，100%风格化最强',
            '生成质量：建议选择"高质量"模式',
            '如果对结果不满意，可以调整描述重新生成'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: '🔧 故障排除',
      icon: '🔧',
      content: [
        {
          title: '生成失败或无响应',
          description: '如果遇到生成失败的情况，可以尝试以下解决方案。',
          tips: [
            '检查网络连接是否稳定',
            '刷新页面重试',
            '简化描述内容，避免过于复杂的表述',
            '检查是否还有剩余生成次数',
            '如问题持续，请联系客服'
          ]
        },
        {
          title: '图片质量不理想',
          description: '如果生成的图片不符合预期，可以尝试以下优化方法。',
          tips: [
            '调整描述的详细程度，增加关键词',
            '尝试不同的风格模板',
            '开启AI智能优化功能',
            '调整风格强度参数',
            '参考优秀作品的描述方式'
          ]
        },
        {
          title: '账户和点数问题',
          description: '关于账户登录、点数使用等常见问题的解决方案。',
          tips: [
            '忘记密码：使用邮箱重置密码功能',
            '点数不足：可购买点数包或升级会员',
            '注册问题：确保邮箱格式正确且未被注册',
            '登录异常：清除浏览器缓存后重试'
          ]
        }
      ]
    }
  ]

  const quickLinks = [
    { name: '常见问题', href: '/faq', icon: '❓', desc: '查看常见问题解答' },
    { name: '联系我们', href: '/contact', icon: '💬', desc: '获得人工支持' },
    { name: '功能特点', href: '/features', icon: '⭐', desc: '了解平台功能' },
    { name: '价格方案', href: '/pricing', icon: '💰', desc: '查看会员价格' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              帮助中心
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            详细的使用指南，帮助您快速掌握AI图像生成的技巧和方法
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {helpSections.length} 个详细指南章节
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-600/30 shadow-2xl sticky top-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                目录
              </h2>
              <nav className="space-y-2">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-gray-300 hover:bg-zinc-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* 快速链接 */}
              <div className="mt-8 pt-6 border-t border-zinc-600/30">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">快速链接</h3>
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block p-2 text-sm text-gray-400 hover:text-blue-300 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区 */}
          <div className="lg:w-3/4">
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
              {helpSections.map((section) => (
                <div
                  key={section.id}
                  className={`${activeSection === section.id ? 'block' : 'hidden'}`}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                      <span className="text-3xl">{section.icon}</span>
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {section.content.map((item, index) => (
                      <div key={index} className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-600/20">
                        <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                            {index + 1}
                          </span>
                          {item.title}
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        {item.tips && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                              <span>💡</span>
                              小贴士
                            </h4>
                            <ul className="space-y-1">
                              {item.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-green-200 text-sm flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 返回首页按钮 */}
        <div className="text-center mt-12">
          <Link
            href={getLocalizedPath('/', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 