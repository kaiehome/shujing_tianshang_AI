'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { PRICING_CONFIG, type BillingCycle } from '../lib/pricingConfig'
import Link from 'next/link'
import { getCurrentLocale, getLocalizedPath } from '../lib/i18n'

export default function PricingPage() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const currentLocale = getCurrentLocale(pathname)

    // 检查用户登录状态
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me')
                const isLoggedIn = response.ok
                setIsUserLoggedIn(isLoggedIn)
            } catch (error) {
                setIsUserLoggedIn(false)
            }
        }
        
        checkAuth()
    }, [])

    const handleUpgrade = (plan: 'pro' | 'ultimate') => {
        if (!isUserLoggedIn) {
            // 如果未登录，重定向到登录页面，并带上返回URL
            router.push(`/login?returnUrl=/payment?plan=${plan}&cycle=${billingCycle}`)
        } else {
            // 如果已登录，直接跳转到支付页面
            router.push(`/payment?plan=${plan}&cycle=${billingCycle}`)
        }
    }

    // 处理点数包购买
    const handlePointPackagePurchase = (packageId: string) => {
        if (isUserLoggedIn === null) {
            // 还在检查登录状态，暂时不处理
            return
        }
        
        if (!isUserLoggedIn) {
            // 如果未登录，重定向到登录页面，并带上返回URL
            router.push(`/login?returnUrl=/payment?package=${packageId}`)
        } else {
            // 如果已登录，直接跳转到支付页面
            router.push(`/payment?package=${packageId}`)
        }
    }

    const getPrice = (plan: 'pro' | 'ultimate') => {
        const monthlyPrice = plan === 'pro' ? 10 : 20;
        if (billingCycle === 'yearly') {
            // 年付优惠 20%
            return `$${(monthlyPrice * 12 * 0.8).toFixed(0)}/年`;
        } else {
            return `$${monthlyPrice}/月`;
        }
    };

    const pointPackages = [
        {
            id: '30',
            points: '30 点',
            price: '¥9',
            generations: '生成 30 次图像（每次4图）',
            validity: '有效期 30 天',
            description: '轻量使用',
            color: 'from-blue-500 to-cyan-500',
            popular: false
        },
        {
            id: '100',
            points: '100 点',
            price: '¥27',
            generations: '生成 100 次图像',
            validity: '更划算的选择',
            description: '平衡选择',
            color: 'from-purple-500 to-pink-500',
            popular: true
        },
        {
            id: '300',
            points: '300 点',
            price: '¥66',
            generations: '生成 300 次图像',
            validity: '推荐给高频创作者',
            description: '高频使用',
            color: 'from-orange-500 to-red-500',
            popular: false
        }
    ];

    const membershipPlans = [
        {
            id: 'monthly',
            title: '月度会员',
            price: '¥29',
            period: '/ 月',
            features: ['无限生成图像', '无水印下载', '全部模板解锁', '优先生成队列'],
            color: 'from-blue-500 to-purple-500',
            comingSoon: true
        },
        {
            id: 'quarterly',
            title: '季度会员',
            price: '¥79',
            period: '/ 季',
            features: ['月度会员全部权益', '额外赠送专属活动点数', '专属会员标识', '提前体验新功能'],
            color: 'from-purple-500 to-pink-500',
            comingSoon: true,
            popular: true
        },
        {
            id: 'yearly',
            title: '年度会员',
            price: '¥288',
            period: '/ 年',
            features: ['季度会员全部权益', '最高优惠价格', '专属客服支持', '优先新功能体验'],
            color: 'from-orange-500 to-red-500',
            comingSoon: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
            <div className="max-w-6xl mx-auto w-full py-8 px-4">
                {/* Hero Section - 标题区 */}
                <section className="flex flex-col items-center justify-center text-center mb-12" id="pricing-hero">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                            <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                            价格方案
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-4 whitespace-nowrap">
                        灵活计费，按需付费 - 点数制与会员订阅双重选择
                    </p>
                    <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-900/20 px-4 py-2 rounded-full border border-orange-500/30">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        满足不同用户的使用频率和预算需求
                    </div>
                </section>

                {/* Point Packages Section - 点数包 */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-white">点数包（一次性购买）</h2>
                            <span className="text-sm text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
                                适合偶尔使用、轻量需求的用户
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pointPackages.map((pkg) => (
                                <div 
                                    key={pkg.id}
                                    className={`group relative bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 backdrop-blur-sm p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                                        pkg.popular
                                            ? 'border-blue-400 ring-4 ring-blue-400/30 shadow-xl shadow-blue-500/25'
                                            : 'border-zinc-600/50 hover:border-blue-400/70'
                                    }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                                推荐
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-xl text-white text-2xl font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {pkg.points.split(' ')[0]}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{pkg.points}</h3>
                                        <div className="text-3xl font-black text-blue-400 mb-1">{pkg.price}</div>
                                        <div className="text-sm text-gray-400">{pkg.description}</div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {pkg.generations}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {pkg.validity}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handlePointPackagePurchase(pkg.id)}
                                        className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${pkg.color} text-white hover:shadow-lg`}
                                    >
                                        立即购买
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Membership Plans Section - 高级会员订阅 */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-2xl py-8 px-8 border border-zinc-600/30 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-white">高级会员订阅</h2>
                            <span className="text-sm text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
                                即将上线
                            </span>
                            <span className="text-sm text-gray-400">适合重度使用用户</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {membershipPlans.map((plan) => (
                                <div 
                                    key={plan.id}
                                    className={`group relative bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 backdrop-blur-sm p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                                        plan.popular
                                            ? 'border-yellow-400 ring-4 ring-yellow-400/30 shadow-xl shadow-yellow-500/25'
                                            : 'border-zinc-600/50 hover:border-purple-400/70'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                                👑 推荐
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl text-white text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            💎
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-black text-purple-400">{plan.price}</span>
                                            <span className="text-gray-400">{plan.period}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                                            plan.comingSoon
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg transform hover:scale-105`
                                        }`}
                                        disabled={plan.comingSoon}
                                    >
                                        {plan.comingSoon ? '即将上线' : '立即订阅'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Free Benefits Section - 免费体验权益 */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-green-600/20 via-teal-600/20 to-cyan-600/20 border border-green-500/30 rounded-2xl p-8">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            <h3 className="text-2xl font-bold text-green-300">免费体验权益</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                                <div className="text-4xl mb-3">🎁</div>
                                <h4 className="text-lg font-bold text-green-300 mb-2">注册礼包</h4>
                                <p className="text-green-200 text-sm">新用户赠送 10 点免费生成点数<br/>（限时3天内使用）</p>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                                <div className="text-4xl mb-3">🎯</div>
                                <h4 className="text-lg font-bold text-blue-300 mb-2">活动奖励</h4>
                                <p className="text-blue-200 text-sm">参与打卡、分享、任务<br/>可领取点数奖励</p>
                            </div>
                            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                                <div className="text-4xl mb-3">🎨</div>
                                <h4 className="text-lg font-bold text-purple-300 mb-2">节日模板</h4>
                                <p className="text-purple-200 text-sm">部分节日模板限时<br/>对所有用户免费开放</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Notes Section - 注意事项 */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 border border-yellow-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="text-lg font-bold text-yellow-300">注意事项</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>每次点击「生成图像」将消耗 1 点（默认生成4张）</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>点数仅限当前账号使用，不支持转移或退款</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 返回首页按钮 */}
                <section className="text-center">
                    <Link
                        href={getLocalizedPath('/', currentLocale)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        返回首页
                    </Link>
                </section>
            </div>
        </div>
    )
}