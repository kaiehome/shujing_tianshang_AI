export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    nav: {
      features: '功能特点',
      pricing: '价格方案',
      faq: '常见问题',
      login: '登录',
      register: '注册',
      myWorks: '我的作品',
      history: '我的作品',
      points: '点数'
    },
    footer: {
      quickLinks: '快速链接',
      support: '支持',
      features: '功能特点',
      pricing: '价格方案',
      faq: '常见问题',
      helpCenter: '帮助中心',
      contactUs: '联系我们',
      terms: '使用条款',
      copyright: '© 2025 Artbud. All rights reserved.'
    },
    brand: {
      name: 'ARTBUD.SPACE',
      slogan: '让创作更简单，让想象更自由'
    },
    language: {
      chinese: '中文',
      english: 'English'
    },
    floatingButton: {
      myWorks: '我的作品',
      myWorksLocked: '🔒我的作品',
      contactUs: '给我留言',
      backToTop: '回到顶部',
      viewMyWorksTooltip: '查看我的作品',
      registerTooltip: '注册后可查看作品历史'
    },
    home: {
      heroTitle: 'Artbud',
      heroSlogan: '✨ AI绘图，让创作更简单 ✨',
      heroDescription: '体验最先进的AI图像生成技术，只需输入文字描述，即可创造出令人惊叹的艺术作品。支持多种艺术风格，从写实摄影到抽象艺术，让您的创意无限延伸。',
      guestLimitNotice: '还剩 {count} 次免费生成机会（每次可生成4张图片），',
      registerForPoints: '注册领取30点数',
      generateResults: '生成结果',
      guestMode: '访客模式',
      newUserBenefits: '新用户专享福利',
      registerReward: {
        title: '注册即送',
        points: '30点数',
        description: '足够生成多张精美图片'
      },
      fullFeatures: {
        title: '全功能体验',
        styles: '18种风格',
        description: '专业模板随意使用'
      },
      hdDownload: {
        title: '高清下载',
        free: '免费导出',
        description: '商用授权无水印'
      },
      registerButton: '现在注册，领取新人礼包 🎁',
      quickTips: {
        title: '使用小贴士',
        tips: [
          '详细描述场景、人物、色彩，生成效果更佳',
          '不同风格适合不同应用场景',
          '可调节风格强度来控制效果',
          '支持多种分辨率和布局选项',
          '生成的图片可免费下载使用'
        ]
      },
      devTools: {
        title: '开发测试工具',
        resetButton: '重置访客限制',
        currentStatus: '当前状态: {remaining}/{total} 次生成剩余',
        antiSpam: '防刷: {message}'
      }
    }
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQs',
      login: 'Login',
      register: 'Sign Up',
      myWorks: 'My Works',
      history: 'History',
      points: 'Points'
    },
    footer: {
      quickLinks: 'Quick Links',
      support: 'Support',
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQs',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      terms: 'Terms of Service',
      copyright: '© 2025 Artbud Space. All rights reserved.'
    },
    brand: {
      name: 'ARTBUD.SPACE',
      slogan: 'Make creation easier, make imagination freer'
    },
    language: {
      chinese: '中文',
      english: 'English'
    },
    floatingButton: {
      myWorks: 'My Works',
      myWorksLocked: '🔒My Works',
      contactUs: 'Contact Us',
      backToTop: 'Back to Top',
      viewMyWorksTooltip: 'View my works',
      registerTooltip: 'Register to view work history'
    },
    home: {
      heroTitle: 'Artbud',
      heroSlogan: '✨ AI Art Creation Made Simple ✨',
      heroDescription: 'Experience cutting-edge AI image generation technology. Simply enter text descriptions to create stunning artworks. Support various artistic styles, from realistic photography to abstract art, unleashing your creativity without limits.',
      guestLimitNotice: '{count} free generation opportunities remaining (4 images per generation), ',
      registerForPoints: 'Register for 30 points',
      generateResults: 'Generation Results',
      guestMode: 'Guest Mode',
      newUserBenefits: 'Exclusive Benefits for New Users',
      registerReward: {
        title: 'Sign up bonus',
        points: '30 Points',
        description: 'Enough to generate multiple beautiful images'
      },
      fullFeatures: {
        title: 'Full Features',
        styles: '18 Styles',
        description: 'Professional templates at will'
      },
      hdDownload: {
        title: 'HD Download',
        free: 'Free Export',
        description: 'Commercial license without watermark'
      },
      registerButton: 'Register Now & Get Welcome Gift 🎁',
      quickTips: {
        title: 'Quick Tips',
        tips: [
          'Detailed descriptions of scenes, characters, and colors work better',
          'Different styles suit different application scenarios',
          'Adjust style strength to control effects',
          'Support multiple resolutions and layout options',
          'Generated images can be downloaded and used for free'
        ]
      },
      devTools: {
        title: 'Development Testing Tools',
        resetButton: 'Reset Guest Limit',
        currentStatus: 'Current Status: {remaining}/{total} generations remaining',
        antiSpam: 'Anti-spam: {message}'
      }
    }
  }
};

export function getTranslations(locale: Locale) {
  return translations[locale];
} 