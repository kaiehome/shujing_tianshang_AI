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
      copyright: '© 2025 Artbud. All rights reserved.',
      aiDriven: 'AI驱动创作'
    },
    brand: {
      name: 'ARTBUD.SPACE',
      slogan: '让创作更简单，让想象更自由',
      aiDriven: 'AI驱动创作'
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
      heroTitle: 'ARTBUD.SPACE',
      heroSlogan: '让创作更简单，让想象更自由',
      heroDescription: '基于最新 AI 技术，为您提供专业级图像生成服务。支持多种艺术风格，一键生成高质量作品。',
      step1: '第一步',
      step2: '第二步',
      step3: '第三步',
      selectRole: '选择一个角色',
      selectStyle: '选择一个风格',
      inputPrompt: '输入你的提示词',
      currentRole: '您当前选择的角色:',
      stylesAvailable: '种专业风格可选',
      generateResults: '生成结果',
      guestMode: '访客模式',
      newUserBenefits: '新用户专属福利',
      registerReward: {
        title: '注册奖励',
        points: '10 点数',
        description: '新用户注册即送'
      },
      fullFeatures: {
        title: '全功能体验',
        styles: '30+ 风格',
        description: '解锁所有创作模板'
      },
      hdDownload: {
        title: '高清下载',
        free: '完全免费',
        description: '无水印高清图片'
      },
      registerButton: '加入我们，开启创作',
      quickTips: {
        title: '使用技巧',
        tips: [
          '选择合适的角色和风格能让生成效果更佳',
          '提示词越详细，生成的图像越符合预期',
          '可以尝试不同的参数设置来获得理想效果',
          '支持上传参考图片来辅助生成',
          '注册用户可享受更多生成次数和高级功能',
          '生成的图片支持高清下载和在线编辑'
        ]
      },
      devTools: {
        title: '开发工具',
        resetButton: '重置每日限制',
        currentStatus: '当前状态: {remaining}/{total} 次',
        antiSpam: '防刷信息: {message}'
      },
      guideSelectRole: '请选择你的创作角色，体验不同风格！',
      welcomeBanner: '🎉 新用户专享10点免费额度，注册即领！',
      welcomeBack: 'Hi，{nickname}，欢迎回来！你已生成{count}张作品。',
      milestoneReward: '🎁 恭喜你已生成{milestone}张作品，额外赠送{points}点体验额度！',
      firstGeneration: '👏 你已成功生成第一张作品，继续探索更多风格吧！',
      festivalBanner: '🎨 节日专属模板限时免费体验！'
    },
    styles: {
      professional: '专业级',
      chineseFriendly: '中文友好',
      selected: '已选中',
      useThisStyle: '使用此风格',
      stylesCount: '{count} 种风格',
      noPreview: '暂无预览',
      categories: {
        'social': '小红书|微博|抖音创作者',
        'healing': '情绪疗愈|身心灵用户',
        'designer': '自由职业设计师|小众创意工作者',
        'education': '教培类|课程内容创作者',
        'journal': '手帐|插画爱好者',
        'ecommerce': '微商|电商运营者',
        'heritage': '非遗--蜀锦蜀绣制作者'
      },
      categoryDescriptions: {
        'social': '专为社交媒体内容创作打造，包含极简ins风、治愈系插画、生活方式插画等适合分享的风格。',
        'healing': '专注于情绪表达和心灵疗愈，提供冥想插画、水彩情绪图、心灵卡片风等温暖治愈的风格。',
        'designer': '面向专业设计需求，涵盖品牌插画风、Logo草图风、概念视觉Moodboard等商业级风格。',
        'education': '专为教育场景设计，包含板书感插画、知识图谱风、可爱教学插图等教学友好的风格。',
        'journal': '满足个人创作喜好，提供手绘贴纸风、日式可爱插画、故事性插图等趣味性风格。',
        'ecommerce': '针对营销推广需求，涵盖促销图风格、节日热点模板、商品展示图等商业应用风格。',
        'heritage': '中国非物质文化遗产传承人，专注于蜀锦蜀绣艺术风格的创作，融合传统织锦与刺绣工艺，展现东方美学与匠心精神。'
      }
    },
    pricing: {
      title: '价格方案',
      subtitle: '灵活计费，按需付费 - 点数制与会员订阅双重选择',
      description: '满足不同用户的使用频率和预算需求',
      pointPackages: {
        title: '点数包',
        subtitle: '适合偶尔使用、轻量需求的用户',
        package50: {
          points: '50 点',
          price: '¥15',
          generations: '生成 50 次图像（每次4图）',
          validity: '有效期 60 天',
          description: '轻量使用'
        },
        package100: {
          points: '100 点',
          price: '¥27',
          generations: '生成 100 次图像',
          validity: '更划算的选择',
          description: '平衡选择'
        },
        package300: {
          points: '300 点',
          price: '¥75',
          generations: '生成 300 次图像',
          validity: '推荐给高频创作者',
          description: '高频使用'
        },
        buyNow: '立即购买',
        recommended: '推荐'
      },
      membership: {
        title: '高级会员订阅',
        subtitle: '即将上线',
        description: '适合重度使用用户',
        monthly: {
          title: '月度会员',
          price: '¥42',
          period: '/ 月',
          features: ['每月可获得200点数', '无水印下载', '全部模板解锁', '优先生成队列']
        },
        semiannual: {
          title: '半年会员',
          price: '¥180',
          period: '/ 半年',
          features: ['可获得1200点数', '无水印下载', '全部模板解锁', '优先生成队列', '优先新功能体验']
        },
        yearly: {
          title: '年度会员',
          price: '¥325',
          period: '/ 年',
          features: ['每年可获得2500点数', '无水印下载', '全部模板解锁', '优先生成队列', '优先新功能体验']
        },
        comingSoon: '即将上线',
        subscribe: '立即订阅'
      },
      freeBenefits: {
        title: '免费体验权益',
        signupGift: {
          title: '注册礼包',
          description: '新用户赠送 10 点免费生成点数（限时3天内使用）'
        },
        activityRewards: {
          title: '活动奖励',
          description: '参与打卡、分享、任务可领取点数奖励'
        },
        holidayTemplates: {
          title: '节日模板',
          description: '部分节日模板限时对所有用户免费开放'
        }
      },
      importantNotes: {
        title: '注意事项',
        note1: '每次点击「生成图像」将消耗 1 点（默认生成4张）',
        note2: '点数仅限当前账号使用，不支持转移或退款'
      },
      backToHome: '返回首页'
    },
    generation: {
      inputPrompt: '请输入提示词',
      selectAspectRatio: '请选择图像尺寸比例',
      optimizing: 'AI优化中...',
      translating: '翻译中...',
      generate: '生成',
      generationFailed: '生成失败，请重试',
      optimizationComplete: 'AI优化完成！',
      optimizationFailed: 'AI优化失败，使用基础翻译',
      translationFailed: '翻译失败，使用原始提示词',
      generationComplete: '图像生成完成！',
      promptPlaceholder: '请在这里输入您的创意点子...',
      aiOptimization: '支持中文AI智能优化',
      basicTranslation: '基础翻译：',
      step1: '第一步',
      step2: '第二步',
      step3: '第三步',
      step4: '完成',
      preparingCreation: '准备创作',
      understandingRequirements: '理解需求',
      aiPainting: 'AI绘画中',
      presentingWork: '作品呈现',
      generationSteps: '第{current}步 / 共{total}步',
      generationFailed2: '生成失败',
      maxUploadReached: '最多只能上传3张图片',
      uploadImageFileOnly: '请只上传图片文件',
      imageSizeLimit: '图片大小不能超过5MB',
      generating: '生成中...',
      generateNow: '立即生成',
      uploadReference: '上传参考图 (图生图)',
      addImage: '添加',
      removeImage: '移除图片',
      promptDescription: '描述提示词',
      promptPlaceholderDetailed: '详细描述您想要生成的图像...',
      characterCount: '{count}/500',
      paramLabels: {
        aspectRatio: '画面比例',
        resolution: '图像分辨率',
        quality: '生成质量',
        styleStrength: '风格强度',
        lighting: '光照效果',
        mood: '色彩氛围'
      },
      paramDescriptions: {
        aspectRatio: '控制生成图像的宽高比例',
        resolution: '越高的分辨率生成时间越长',
        quality: '影响图像细节和生成时间',
        styleStrength: '控制AI风格应用的强度',
        lighting: '影响图像的光影效果',
        mood: '影响图像的整体色调氛围'
      },
      paramOptions: {
        aspectRatio: {
          '1:1': '⬜ 1:1 正方形',
          '4:3': '📺 4:3 传统屏',
          '16:9': '🖥️ 16:9 宽屏',
          '9:16': '📱 9:16 竖屏'
        },
        resolution: {
          '512x512': '512×512 (标准)',
          '768x768': '768×768 (高清)',
          '1024x768': '1024×768 (横版高清)',
          '768x1024': '768×1024 (竖版高清)',
          '1024x1024': '1024×1024 (超高清)'
        },
        quality: {
          'draft': '草图 (快速)',
          'standard': '标准质量',
          'high': '高质量',
          'ultra': '超高质量 (慢)'
        },
        styleStrength: {
          '0.3': '轻微 (30%)',
          '0.5': '适中 (50%)',
          '0.7': '标准 (70%)',
          '0.9': '强烈 (90%)'
        },
        lighting: {
          '': '自动光照',
          'soft': '柔光',
          'hard': '硬光',
          'dramatic': '戏剧光',
          'natural': '自然光',
          'studio': '影棚光'
        },
        mood: {
          '': '默认氛围',
          'warm': '温暖',
          'cool': '冷色调',
          'vibrant': '鲜艳',
          'muted': '柔和',
          'mysterious': '神秘'
        }
      },
      statusMessages: {
        authenticated: '无限制使用',
        vip: '无限制使用',
        remainingToday: '今日剩余：{remaining}/{total}次',
        guestMode: '访客模式：限时免费体验'
      },
      promptTips: {
        title: '💡 描述提示',
        emptyPrompt: '可以直接点击"立即生成"使用当前风格的默认提示词，也可以输入自己的描述来生成个性化图像。',
        withPrompt: '描述越详细，生成的图像越符合您的期望。可以包含：物体、场景、风格、颜色、光线等细节。'
      }
    },
    auth: {
      login: '登录',
      register: '注册',
      logout: '登出',
      loginSuccess: '登录成功！',
      loginFailed: '登录失败',
      registerNow: '立即注册',
      gotoLogin: '前往登录',
      loginRequired: '需要登录',
      pleaseLoginFirst: '请先登录以查看您的作品',
      loginToDownload: '请登录后下载图像',
      loginToFavorite: '请登录后收藏图像',
      loginToUseFeature: '请登录后使用此功能',
      registerBonus: '注册即获 10 点免费生成点数',
      registerToUnlock: '注册解锁完整功能',
      registerForHighRes: '注册后可下载高清图片',
      registerToSave: '注册后可收藏作品',
      registerToEdit: '注册后可编辑图片',
      enterPhone: '请输入手机号',
      enterVerificationCode: '请输入验证码',
      sendingCode: '发送中...',
      sendCode: '发送验证码',
      loggingIn: '登录中...'
    },
    common: {
      preview: '预览',
      download: '下载',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      favorite: '收藏',
      share: '分享',
      back: '返回',
      next: '下一步',
      confirm: '确认',
      cancel: '取消',
      close: '关闭',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      failed: '失败',
      tryAgain: '重试',
      comingSoon: '即将上线',
      recommended: '推荐',
      free: '免费',
      unlimited: '无限制',
      points: '点数',
      remaining: '剩余',
      used: '已用',
      total: '总计',
      days: '天',
      hours: '小时',
      minutes: '分钟',
      seconds: '秒'
    },
    growth: {
      thankYou: "感谢你的每一次创作，愿AI为你的灵感添彩！",
      milestone: (count: number) => `你已生成${count}张作品，继续探索更多可能吧！`
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
      copyright: '© 2025 Artbud Space. All rights reserved.',
      aiDriven: 'AI-powered Creation'
    },
    brand: {
      name: 'ARTBUD.SPACE',
      slogan: 'Make creation easier, make imagination freer',
      aiDriven: 'AI-powered Creation'
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
      heroTitle: 'ARTBUD.SPACE',
      heroSlogan: 'Make creation easier, make imagination freer',
      heroDescription: 'Experience cutting-edge AI image generation technology. Simply enter text descriptions to create stunning artworks. Support various artistic styles, from realistic photography to abstract art, unleashing your creativity without limits.',
      step1: 'Step 1',
      step2: 'Step 2',
      step3: 'Step 3',
      selectRole: 'Choose a Role',
      selectStyle: 'Choose a Style',
      inputPrompt: 'Enter Your Prompt',
      currentRole: 'Your currently selected role:',
      stylesAvailable: 'professional styles available',
      generateResults: 'Generation Results',
      guestMode: 'Guest Mode',
      newUserBenefits: 'Exclusive Benefits for New Users',
      registerReward: {
        title: 'Sign up bonus',
        points: '10 Points',
        description: 'Free points for new users'
      },
      fullFeatures: {
        title: 'Full Features',
        styles: '30+ Styles',
        description: 'Unlock all creative templates'
      },
      hdDownload: {
        title: 'HD Download',
        free: 'Completely Free',
        description: 'High-quality images without watermark'
      },
      registerButton: 'Join Us & Start Creating',
      quickTips: {
        title: 'Quick Tips',
        tips: [
          'Choosing the right role and style can improve generation results',
          'The more detailed the prompt, the better the generated image matches expectations',
          'Try different parameter settings to achieve ideal results',
          'Support uploading reference images to assist generation',
          'Registered users enjoy more generation times and advanced features',
          'Generated images support HD download and online editing'
        ]
      },
      devTools: {
        title: 'Development Tools',
        resetButton: 'Reset Daily Limit',
        currentStatus: 'Current Status: {remaining}/{total} times',
        antiSpam: 'Anti-spam info: {message}'
      },
      guideSelectRole: 'Please choose your creative role to explore different styles!',
      welcomeBanner: '🎉 New users get 10 free credits, register now!',
      welcomeBack: 'Hi, {nickname}, welcome back! You have generated {count} images.',
      milestoneReward: '🎁 Congrats! You have generated {milestone} images and earned {points} bonus credits!',
      firstGeneration: '👏 You have generated your first image! Try more styles!',
      festivalBanner: '🎨 Festival exclusive templates, free for a limited time! '
    },
    styles: {
      professional: 'Professional',
      chineseFriendly: 'Chinese Friendly',
      selected: 'Selected',
      useThisStyle: 'Use This Style',
      stylesCount: '{count} styles',
      noPreview: 'No Preview',
      categories: {
        'social': 'Social Media Creators',
        'healing': 'Emotional Wellness Seekers',
        'designer': 'Independent Creatives',
        'education': 'Education Content Creators',
        'journal': 'Journaling & Illustration Enthusiasts',
        'ecommerce': 'E-commerce & Social Sellers',
        'heritage': 'Intangible Cultural Heritage – Shu Brocade and Embroidery Craftsman'
      },
      categoryDescriptions: {
        'social': 'For creators on platforms like Xiaohongshu, Weibo, and Douyin. Covers daily lifestyle, healing, and eye-catching illustration styles.',
        'healing': 'For those seeking emotional wellness, meditation, and spiritual healing. Includes meditation, watercolor, and energy art.',
        'designer': 'For independent creatives and niche artists. Ideal for creative images, handmade crafts, and visual style exploration.',
        'education': 'For online educators and course designers. Perfect for teaching illustrations, lecture visuals, and educational aids.',
        'journal': 'For journaling and illustration enthusiasts. Great for journaling art, stickers, and creative sketching.',
        'ecommerce': 'For e-commerce and social sellers. Suited for product images, main visuals, and promotional graphics.',
        'heritage': 'For those dedicated to traditional Chinese arts. Focuses on Shu brocade and embroidery, blending heritage with modern creativity.'
      }
    },
    pricing: {
      title: 'Pricing Plans',
      subtitle: 'Flexible billing, pay-as-you-go - Point system and membership subscription dual options',
      description: 'Meet different users\' usage frequency and budget needs',
      pointPackages: {
        title: 'Point Packages',
        subtitle: 'Suitable for occasional use and light demand users',
        package50: {
          points: '50 Points',
          price: '$2.1',
          generations: 'Generate 50 images (4 images per generation)',
          validity: 'Valid for 60 days',
          description: 'Light usage'
        },
        package100: {
          points: '100 Points',
          price: '$3.8',
          generations: 'Generate 100 images',
          validity: 'Better value choice',
          description: 'Balanced choice'
        },
        package300: {
          points: '300 Points',
          price: '$10.5',
          generations: 'Generate 300 images',
          validity: 'Recommended for high-frequency creators',
          description: 'High-frequency usage'
        },
        buyNow: 'Buy Now',
        recommended: 'Recommended'
      },
      membership: {
        title: 'Premium Membership',
        subtitle: 'Coming Soon',
        description: 'Suitable for heavy users',
        monthly: {
          title: 'Monthly Plan',
          price: '$5.9',
          period: '/ month',
          features: ['Get 200 points monthly', 'Watermark-free download', 'All templates unlocked', 'Priority generation queue']
        },
        semiannual: {
          title: 'Semi-annual Plan',
          price: '$25.2',
          period: '/ 6 months',
          features: ['Get 1200 points', 'Watermark-free download', 'All templates unlocked', 'Priority generation queue', 'Priority access to new features']
        },
        yearly: {
          title: 'Annual Plan',
          price: '$45.5',
          period: '/ year',
          features: ['Get 2500 points annually', 'Watermark-free download', 'All templates unlocked', 'Priority generation queue', 'Priority access to new features']
        },
        comingSoon: 'Coming Soon',
        subscribe: 'Subscribe Now'
      },
      freeBenefits: {
        title: 'Free Experience Benefits',
        signupGift: {
          title: 'Registration Gift',
          description: 'New users get 10 free generation points (Valid for 3 days)'
        },
        activityRewards: {
          title: 'Activity Rewards',
          description: 'Participate in check-ins, sharing, tasks to earn point rewards'
        },
        holidayTemplates: {
          title: 'Holiday Templates',
          description: 'Some holiday templates are temporarily free for all users'
        }
      },
      importantNotes: {
        title: 'Important Notes',
        note1: 'Each click on "Generate Image" consumes 1 point (generates 4 images by default)',
        note2: 'Points are limited to current account use, no transfer or refund supported'
      },
      backToHome: 'Back to Home'
    },
    generation: {
      inputPrompt: 'Please enter prompt',
      selectAspectRatio: 'Please select image aspect ratio',
      optimizing: 'AI optimizing...',
      translating: 'Translating...',
      generate: 'Generate',
      generationFailed: 'Generation failed, please try again',
      optimizationComplete: 'AI optimization complete!',
      optimizationFailed: 'AI optimization failed, using basic translation',
      translationFailed: 'Translation failed, using original prompt',
      generationComplete: 'Image generation complete!',
      promptPlaceholder: 'Enter your creative ideas here...',
      aiOptimization: 'Support Chinese AI intelligent optimization',
      basicTranslation: 'Basic translation:',
      step1: 'Step 1',
      step2: 'Step 2',
      step3: 'Step 3',
      step4: 'Complete',
      preparingCreation: 'Preparing Creation',
      understandingRequirements: 'Understanding Requirements',
      aiPainting: 'AI Painting',
      presentingWork: 'Presenting Work',
      generationSteps: 'Step {current} / {total}',
      generationFailed2: 'Generation Failed',
      maxUploadReached: 'Maximum 3 images can be uploaded',
      uploadImageFileOnly: 'Please upload image files only',
      imageSizeLimit: 'Image size cannot exceed 5MB',
      generating: 'Generating...',
      generateNow: 'Generate Now',
      uploadReference: 'Upload Reference (Image-to-Image)',
      addImage: 'Add',
      removeImage: 'Remove Image',
      promptDescription: 'Prompt Description',
      promptPlaceholderDetailed: 'Describe the image you want to generate in detail...',
      characterCount: '{count}/500',
      paramLabels: {
        aspectRatio: 'Aspect Ratio',
        resolution: 'Image Resolution',
        quality: 'Generation Quality',
        styleStrength: 'Style Strength',
        lighting: 'Lighting Effect',
        mood: 'Color Mood'
      },
      paramDescriptions: {
        aspectRatio: 'Control the aspect ratio of generated images',
        resolution: 'Higher resolution takes longer to generate',
        quality: 'Affects image details and generation time',
        styleStrength: 'Control the intensity of AI style application',
        lighting: 'Affects the lighting effects of the image',
        mood: 'Affects the overall color tone and atmosphere of the image'
      },
      paramOptions: {
        aspectRatio: {
          '1:1': '⬜ 1:1 Square',
          '4:3': '📺 4:3 Traditional',
          '16:9': '🖥️ 16:9 Widescreen',
          '9:16': '📱 9:16 Portrait'
        },
        resolution: {
          '512x512': '512×512 (Standard)',
          '768x768': '768×768 (HD)',
          '1024x768': '1024×768 (Landscape HD)',
          '768x1024': '768×1024 (Portrait HD)',
          '1024x1024': '1024×1024 (Ultra HD)'
        },
        quality: {
          'draft': 'Draft (Fast)',
          'standard': 'Standard Quality',
          'high': 'High Quality',
          'ultra': 'Ultra Quality (Slow)'
        },
        styleStrength: {
          '0.3': 'Light (30%)',
          '0.5': 'Moderate (50%)',
          '0.7': 'Standard (70%)',
          '0.9': 'Strong (90%)'
        },
        lighting: {
          '': 'Auto Lighting',
          'soft': 'Soft Light',
          'hard': 'Hard Light',
          'dramatic': 'Dramatic Light',
          'natural': 'Natural Light',
          'studio': 'Studio Light'
        },
        mood: {
          '': 'Default Mood',
          'warm': 'Warm',
          'cool': 'Cool Tone',
          'vibrant': 'Vibrant',
          'muted': 'Muted',
          'mysterious': 'Mysterious'
        }
      },
      statusMessages: {
        authenticated: 'Unlimited Use',
        vip: 'Unlimited Use',
        remainingToday: 'Remaining Today: {remaining}/{total} times',
        guestMode: 'Guest Mode: Limited Free Trial'
      },
      promptTips: {
        title: '💡 Prompt Tips',
        emptyPrompt: 'You can directly click "Generate Now" to use the default prompt of the current style, or enter your own description to generate personalized images.',
        withPrompt: 'The more detailed the description, the better the generated image matches your expectations. Can include: objects, scenes, styles, colors, lighting and other details.'
      }
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed',
      registerNow: 'Register Now',
      gotoLogin: 'Go to Login',
      loginRequired: 'Login Required',
      pleaseLoginFirst: 'Please login first to view your works',
      loginToDownload: 'Please login to download images',
      loginToFavorite: 'Please login to favorite images',
      loginToUseFeature: 'Please login to use this feature',
      registerBonus: 'Register to get 10 free generation points',
      registerToUnlock: 'Register to unlock full features',
      registerForHighRes: 'Register to download high-resolution images',
      registerToSave: 'Register to save works',
      registerToEdit: 'Register to edit images',
      enterPhone: 'Please enter phone number',
      enterVerificationCode: 'Please enter verification code',
      sendingCode: 'Sending...',
      sendCode: 'Send Code',
      loggingIn: 'Logging in...'
    },
    common: {
      preview: 'Preview',
      download: 'Download',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      favorite: 'Favorite',
      share: 'Share',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      failed: 'Failed',
      tryAgain: 'Try Again',
      comingSoon: 'Coming Soon',
      recommended: 'Recommended',
      free: 'Free',
      unlimited: 'Unlimited',
      points: 'Points',
      remaining: 'Remaining',
      used: 'Used',
      total: 'Total',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds'
    },
    growth: {
      thankYou: "Thank you for every creation. May AI add color to your inspiration!",
      milestone: (count: number) => `You have created ${count} works. Keep exploring more possibilities!`
    }
  }
};

export function getTranslations(locale: Locale) {
  return translations[locale];
} 