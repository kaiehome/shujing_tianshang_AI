"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: 'limit_reached' | 'download_attempt' | 'save_attempt' | 'history_access' | 'edit_attempt' | 'engagement_bonus'
  remainingGenerations: number
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  trigger,
  remainingGenerations
}) => {
  const pathname = usePathname()
  const currentLocale = getCurrentLocale(pathname)
  
  if (!isOpen) return null

  const getTriggerContent = () => {
    switch (trigger) {
      case 'limit_reached':
        return {
          emoji: '🎉',
          text: '今日访客试用已达上限',
          subtitle: '注册立享30点免费点数！',
          benefits: [
            '立即获得30点数，足够生成多张图片',
            '解锁高清无水印下载功能',
            '自动保存生成历史和收藏',
            '享受全部18种专业风格模板',
            '获得AI智能优化高级功能'
          ]
        }
      case 'engagement_bonus':
        return {
          emoji: '🌟',
          text: '您已成为活跃用户！',
          subtitle: '注册即可获得专属福利！',
          benefits: [
            '🎁 新用户专享30点数奖励',
            '🔓 解锁所有高级风格模板',
            '💾 永久保存您的创作历史',
            '📱 高清无水印图片下载',
            '⭐ 专属客服支持和新功能优先体验'
          ]
        }
      case 'download_attempt':
        return {
          emoji: '🔐',
          text: '注册后即可下载高清图像',
          subtitle: '还能保存您的专属图库！',
          benefits: [
            '下载高清无水印图像',
            '商用授权，可用于商业项目',
            '创建个人作品收藏夹',
            '云端同步，随时随地访问',
            '分享作品到社交平台'
          ]
        }
      case 'save_attempt':
        return {
          emoji: '💾',
          text: '注册即可保存您的灵感作品',
          subtitle: '创建您的图像笔记本！',
          benefits: [
            '永久保存生成的图像',
            '按标签分类管理作品',
            '查看详细的生成记录',
            '支持作品备注和编辑',
            '一键分享到社交媒体'
          ]
        }
      case 'history_access':
        return {
          emoji: '📚',
          text: '注册后可查看生成历史',
          subtitle: '管理你的创作记录！',
          benefits: [
            '查看所有生成历史记录',
            '快速复用之前的提示词',
            '按时间线浏览创作过程',
            '导出创作数据和统计',
            '与朋友分享创作历程'
          ]
        }
      case 'edit_attempt':
        return {
          emoji: '✏️',
          text: '注册后可编辑和优化图片',
          subtitle: '解锁强大的编辑功能！',
          benefits: [
            '在线编辑生成的图片',
            '调整图片参数重新生成',
            '添加滤镜和特效',
            '批量编辑多张图片',
            '保存编辑历史版本'
          ]
        }
      default:
        return {
          emoji: '🚀',
          text: '注册解锁完整功能',
          subtitle: '开启你的AI创作之旅！',
          benefits: [
            '获得30点数免费体验',
            '解锁所有高级功能',
            '享受无限制创作体验',
            '专属客服支持',
            '优先体验新功能'
          ]
        }
    }
  }

  const content = getTriggerContent()

  const handleRegister = () => {
    // 跳转到注册页面
    window.location.href = getLocalizedPath('/login', currentLocale)
  }

  const handleContinueTrial = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-600/50 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 关闭按钮 */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 主要内容 */}
        <div className="px-8 pb-8">
          {/* 标题区域 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <span className="text-3xl">{content.emoji}</span>
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {content.text}
              </span>
            </h2>
            <p className="text-gray-300 text-lg">
              {content.subtitle}
            </p>
          </div>

          {/* 剩余次数显示 */}
          {trigger === 'limit_reached' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-center">
              <div className="text-red-400 font-bold text-lg mb-1">
                今日试用已用完
              </div>
              <div className="text-gray-300 text-sm">
                访客每日限制：已用完 {3 - remainingGenerations}/3 次生成（每次4张图片）
              </div>
            </div>
          )}

          {/* 福利列表 */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-green-400">✨</span>
              注册即享特权
            </h3>
            <div className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 新用户福利卡片 */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🎁</div>
              <div className="text-orange-400 font-bold mb-1">新用户专享</div>
              <div className="text-2xl font-bold text-white mb-1">30点数</div>
              <div className="text-gray-300 text-sm">足够生成30+张精美图片</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              现在注册，领取30点数 🚀
            </button>
            
            {trigger !== 'limit_reached' && (
              <button
                onClick={handleContinueTrial}
                className="w-full bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                稍后再说
              </button>
            )}
          </div>

          {/* 底部提示 */}
          <div className="mt-4 text-center text-xs text-gray-400">
            注册完全免费，30秒即可完成
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationModal 