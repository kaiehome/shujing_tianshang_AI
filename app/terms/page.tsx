'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'
import { useTranslations } from '../hooks/useTranslations'

export default function UserAgreement() {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  const { t } = useTranslations()

  const sections = [
    {
      title: '1. 协议的订立与生效',
      content: [
        '1.1 协议主体：本协议由您（用户）与画芽空间（运营方）共同订立。',
        '1.2 协议生效：您注册画芽空间账户或使用本服务即表示同意本用户协议的全部条款。',
        '1.3 协议变更：我们保留修改本协议的权利，变更后将通过网站公告或邮件通知您。',
        '1.4 用户资格：您必须年满18岁或在法定监护人同意下使用本服务。'
      ]
    },
    {
      title: '2. 服务内容与范围',
      content: [
        '2.1 服务定义：画芽空间为您提供基于人工智能技术的图像生成、编辑和相关创作服务。',
        '2.2 服务形式：包括但不限于在线图像生成、模型训练、图像处理等功能。',
        '2.3 服务可用性：我们致力于保持服务稳定运行，但不保证服务100%可用。',
        '2.4 服务改进：我们有权根据技术发展和用户需求对服务进行升级和改进。'
      ]
    },
    {
      title: '3. 用户权利与义务',
      content: [
        '3.1 账户权利：您有权使用已购买的服务、管理个人信息、获得技术支持。',
        '3.2 内容所有权：您对通过本平台创建的原创内容享有著作权。',
        '3.3 合规义务：您有义务遵守相关法律法规，不得利用本服务从事违法活动。',
        '3.4 信息真实性：您应提供真实、准确的注册信息，并及时更新。',
        '3.5 账户安全：您有义务妥善保管账户密码，对账户下的所有活动承担责任。'
      ]
    },
    {
      title: '4. 付费服务与结算',
      content: [
        '4.1 收费模式：本平台采用点数制和会员订阅制两种付费模式。',
        '4.2 付费标准：',
        '  • 点数包：30点(¥9)、100点(¥27)、300点(¥66)',
        '  • 会员服务：按订阅周期收费，享受更多权益',
        '4.3 支付方式：支持微信支付、支付宝等主流支付方式。',
        '4.4 发票服务：企业用户可申请开具增值税发票。',
        '4.5 退款政策：除特殊情况外，已购买的点数和会员服务原则上不予退款。'
      ]
    },
    {
      title: '5. 知识产权协议',
      content: [
        '5.1 平台权利：画芽空间拥有本平台的软件著作权、商标权等知识产权。',
        '5.2 内容授权：您生成的内容归您所有，但授权我们在必要时用于服务改进和推广。',
        '5.3 技术保护：未经许可，您不得逆向工程、破解或复制本平台的技术。',
        '5.4 侵权处理：如发现侵权行为，我们将根据相关法律法规进行处理。'
      ]
    },
    {
      title: '6. 责任限制与免责',
      content: [
        '6.1 服务性质：本服务基于AI技术，生成结果具有一定的随机性和不确定性。',
        '6.2 免责情形：',
        '  • 不可抗力导致的服务中断',
        '  • 用户违规使用造成的后果',
        '  • 第三方行为导致的损失',
        '  • 网络环境或设备问题',
        '6.3 赔偿限制：我们的赔偿责任不超过您为相关服务支付的费用。'
      ]
    },
    {
      title: '7. 协议终止与后续处理',
      content: [
        '7.1 终止情形：用户违约、长期未使用、双方协商一致等情况下可终止协议。',
        '7.2 数据处理：协议终止后，您的个人数据将按照隐私政策进行妥善处理。',
        '7.3 费用处理：终止时的费用按照已使用服务计算，剩余费用原则上不予退还。',
        '7.4 后续义务：协议终止后，双方仍需履行保密等后续义务。'
      ]
    },
    {
      title: '8. 争议解决与法律适用',
      content: [
        '8.1 协商解决：双方应本着友好合作的精神协商解决争议。',
        '8.2 法律适用：本协议受中华人民共和国法律管辖和保护。',
        '8.3 管辖法院：如协商不成，由被告所在地有管辖权的人民法院管辖。',
        '8.4 协议效力：部分条款无效不影响其他条款的法律效力。'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              用户协议
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            画芽空间用户服务协议
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            用户与平台的合同协议
          </div>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              最后更新时间：2025年2月14日 | 生效时间：2025年2月14日
            </p>
          </div>
        </div>

        {/* 重要提示 */}
        <div className="mb-8 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
            <span>⚖️</span>
            法律声明
          </h2>
          <div className="text-red-200 space-y-2 text-sm">
            <p>• 本协议具有法律约束力，请您仔细阅读并充分理解各项条款内容。</p>
            <p>• 注册或使用画芽空间服务即表示您已阅读、理解并同意接受本用户协议。</p>
            <p>• 如您不同意本协议的任何条款，请立即停止使用本服务。</p>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 shadow-2xl">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-zinc-600/30 pb-8 last:border-b-0 last:pb-0">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
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
            href={getLocalizedPath('/usage-terms', currentLocale)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            📋 使用条款
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
            本用户协议受中华人民共和国法律保护
          </p>
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