'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function UsageTerms() {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const { t } = useTranslations()

  const sections = [
    {
      title: '1. 服务使用规范',
      content: [
        '1.1 合法使用：您承诺仅将画芽空间用于合法目的，不得生成违法、有害或侵犯他人权利的内容。',
        '1.2 内容标准：生成的图像内容应符合社会道德和法律法规要求。',
        '1.3 技术使用：您应正确使用平台功能，不得恶意攻击或干扰系统正常运行。',
        '1.4 资源共享：平台资源供所有用户共享，请合理使用，避免过度消耗。'
      ]
    },
    {
      title: '2. 禁止行为',
      content: [
        '2.1 违法内容：严禁生成以下类型的内容：',
        '  • 暴力、血腥、恐怖内容',
        '  • 色情、淫秽、低俗内容',
        '  • 违法犯罪相关内容',
        '  • 政治敏感内容',
        '2.2 侵权行为：',
        '  • 侵犯他人肖像权、隐私权',
        '  • 盗用他人知识产权',
        '  • 恶意模仿他人作品',
        '2.3 系统安全：',
        '  • 禁止尝试破解或攻击系统',
        '  • 禁止恶意刷量或滥用服务',
        '  • 禁止传播恶意软件或病毒'
      ]
    },
    {
      title: '3. 使用限制',
      content: [
        '3.1 生成频率：为保证服务质量，对图像生成频率进行合理限制。',
        '3.2 内容审核：平台有权对生成内容进行审核，发现违规内容将被删除。',
        '3.3 存储限制：免费用户享有有限的存储空间，付费用户享有更大空间。',
        '3.4 下载限制：根据用户等级设置不同的下载次数限制。',
        '3.5 商业使用：商业用途需要获得相应的授权或升级到商业版本。'
      ]
    },
    {
      title: '4. 内容管理',
      content: [
        '4.1 内容所有权：您对原创生成的内容拥有使用权。',
        '4.2 内容分享：您可以选择是否公开分享您的作品。',
        '4.3 举报机制：如发现不当内容，您可以通过举报功能进行反馈。',
        '4.4 内容删除：违规内容将被删除，严重违规可能导致账户封禁。'
      ]
    },
    {
      title: '5. 社区规范',
      content: [
        '5.1 文明交流：在社区互动中应保持礼貌和尊重。',
        '5.2 知识分享：鼓励用户分享创作经验和技巧。',
        '5.3 版权尊重：尊重其他用户的创作成果，不得恶意抄袭。',
        '5.4 协作精神：鼓励用户之间的良性竞争和合作。'
      ]
    },
    {
      title: '6. 技术使用准则',
      content: [
        '6.1 API调用：开发者使用API时应遵守调用频率限制。',
        '6.2 数据安全：保护用户数据安全，不得泄露或滥用。',
        '6.3 系统稳定：不得进行可能影响系统稳定性的操作。',
        '6.4 更新适配：及时适配平台更新，保证功能正常使用。'
      ]
    },
    {
      title: '7. 违规处理',
      content: [
        '7.1 警告机制：首次轻微违规将收到警告通知。',
        '7.2 功能限制：重复违规将被限制部分功能使用。',
        '7.3 账户封禁：严重违规或屡次违规将导致账户封禁。',
        '7.4 申诉渠道：对处理结果有异议可通过客服渠道申诉。'
      ]
    },
    {
      title: '8. 条款更新',
      content: [
        '8.1 更新通知：使用条款更新时将通过网站公告或邮件通知。',
        '8.2 生效时间：新条款自公布之日起生效。',
        '8.3 继续使用：条款更新后继续使用服务即视为同意新条款。',
        '8.4 意见反馈：对条款有意见或建议可通过客服渠道反馈。'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-400 to-red-500 bg-clip-text text-transparent">
              使用条款
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            画芽空间服务使用规范与准则
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-900/20 px-4 py-2 rounded-full border border-purple-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            服务使用规则与行为准则
          </div>
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-purple-200 text-sm">
              最后更新时间：2025年2月14日 | 生效时间：2025年2月14日
            </p>
          </div>
        </div>

        {/* 重要提示 */}
        <div className="mb-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
            <span>📋</span>
            使用须知
          </h2>
          <div className="text-yellow-200 space-y-2 text-sm">
            <p>• 请严格遵守使用条款，确保内容符合法律法规和社会道德标准。</p>
            <p>• 违反使用条款可能导致功能限制或账户封禁。</p>
            <p>• 如有疑问请及时联系客服，我们将为您提供详细指导。</p>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-zinc-600/30 pb-8 last:border-b-0 last:pb-0">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-gray-300 leading-relaxed pl-4">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={getLocalizedPath('/terms', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            ⚖️ 用户协议
          </Link>
          <Link
            href={getLocalizedPath('/privacy', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            🔒 隐私政策
          </Link>
        </div>

        {/* 版权声明 */}
        <div className="mt-8 p-6 bg-zinc-900/30 rounded-xl border border-zinc-600/20 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Artbud Space (artbud.space). 保留所有权利。
          </p>
          <p className="text-gray-500 text-xs mt-2">
            本使用条款受中华人民共和国法律保护
          </p>
        </div>

        {/* 返回首页按钮 */}
        <div className="text-center mt-12">
          <Link
            href={getLocalizedPath('/', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
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