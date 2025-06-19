'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function Privacy() {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              隐私政策
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            画芽空间隐私保护与数据安全政策
          </p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              最后更新时间：2025年2月14日 | 生效时间：2025年2月14日
            </p>
          </div>
        </div>

        {/* 重要承诺 */}
        <div className="mb-8 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <span>🛡️</span>
            我们的承诺
          </h2>
          <div className="text-green-200 space-y-2 text-sm">
            <p>• 我们严格遵守《中华人民共和国个人信息保护法》等相关法律法规。</p>
            <p>• 我们采用业界标准的安全技术和措施保护您的个人信息安全。</p>
            <p>• 我们不会出售您的个人信息，仅在必要时按照本政策使用。</p>
            <p>• 我们尊重您的隐私权利，为您提供便捷的权利行使渠道。</p>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
          <div className="space-y-8">
            
            {/* 信息收集 */}
            <div className="border-b border-zinc-600/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">1</span>
                信息收集
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>账户信息：</strong>注册时收集您的手机号码、用户名等基本信息</p>
                <p>• <strong>使用数据：</strong>生成的图像内容、提示词、使用频次和时长</p>
                <p>• <strong>设备信息：</strong>设备型号、操作系统、浏览器类型、IP地址等</p>
                <p>• <strong>支付信息：</strong>购买服务时的必要支付信息（不存储银行卡密码）</p>
              </div>
            </div>

            {/* 信息使用 */}
            <div className="border-b border-zinc-600/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">2</span>
                信息使用
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>服务提供：</strong>提供AI图像生成服务、身份验证、账户管理</p>
                <p>• <strong>服务改进：</strong>优化算法性能、改善用户体验、开发新功能</p>
                <p>• <strong>安全保护：</strong>防止欺诈和滥用、监测安全威胁、维护服务稳定</p>
                <p>• <strong>法律合规：</strong>遵守法律法规要求和配合执法部门调查</p>
              </div>
            </div>

            {/* 信息保护 */}
            <div className="border-b border-zinc-600/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">3</span>
                信息保护
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>不分享原则：</strong>我们不会出售、交易或转让您的个人信息给第三方</p>
                <p>• <strong>安全措施：</strong>采用数据加密、访问控制、定期安全审计等保护措施</p>
                <p>• <strong>存储位置：</strong>信息主要存储在中华人民共和国境内的安全服务器</p>
                <p>• <strong>员工管理：</strong>严格的员工保密协议和安全培训</p>
              </div>
            </div>

            {/* 您的权利 */}
            <div className="border-b border-zinc-600/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">4</span>
                您的权利
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>访问权：</strong>了解我们收集、使用您个人信息的情况</p>
                <p>• <strong>更正权：</strong>发现个人信息有误时要求我们更正</p>
                <p>• <strong>删除权：</strong>在符合法律要求的情况下要求删除个人信息</p>
                <p>• <strong>账户控制：</strong>查看编辑资料、管理隐私设置、导出数据、注销账户</p>
              </div>
            </div>

            {/* Cookie使用 */}
            <div className="border-b border-zinc-600/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">5</span>
                Cookie使用
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>用途：</strong>使用Cookie和类似技术来改善您的使用体验</p>
                <p>• <strong>类型：</strong>必要Cookie、功能Cookie、分析Cookie</p>
                <p>• <strong>管理：</strong>您可以通过浏览器设置管理Cookie策略</p>
                <p>• <strong>影响：</strong>禁用某些Cookie可能影响网站功能的正常使用</p>
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">6</span>
                联系方式
              </h2>
              <div className="space-y-3 text-gray-300">
                <p>如您对本隐私政策有任何疑问、意见或建议，请联系我们：</p>
                <p>• <strong>客服邮箱：</strong>privacy@artbud.space</p>
                <p>• <strong>在线客服：</strong>通过网站客服功能联系</p>
                <p>• <strong>工作时间：</strong>工作日 9:00-18:00</p>
              </div>
            </div>

          </div>
        </div>

        {/* 权利行使指南 */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            如何行使您的权利
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-200 mb-2">查看个人信息</h3>
              <p className="text-blue-100">登录账户 → 个人设置 → 查看资料</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-purple-200 mb-2">修改个人信息</h3>
              <p className="text-purple-100">登录账户 → 个人设置 → 编辑资料</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-200 mb-2">导出个人数据</h3>
              <p className="text-green-100">联系客服 → 提交申请 → 身份验证</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-200 mb-2">注销账户</h3>
              <p className="text-red-100">个人设置 → 账户安全 → 注销账户</p>
            </div>
          </div>
        </div>

        {/* 版权声明 */}
        <div className="mt-8 p-6 bg-zinc-900/30 rounded-xl border border-zinc-600/20 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Artbud Space (artbud.space). 保留所有权利。
          </p>
          <p className="text-gray-500 text-xs mt-2">
            本隐私政策受中华人民共和国个人信息保护法保护
          </p>
        </div>

        {/* 返回首页按钮 */}
        <div className="text-center mt-12">
          <Link
            href={getLocalizedPath('/', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
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