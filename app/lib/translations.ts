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
      points: '点数',
      image2image: '图生图',
      imageExtend: '图像扩展',
      tts: '语音合成'
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
      seconds: '秒',
      image2image: '图生图'
    },
    growth: {
      thankYou: "感谢你的每一次创作，愿AI为你的灵感添彩！",
      milestone: (count: number) => `你已生成${count}张作品，继续探索更多可能吧！`
    },
    features: {
      title: '功能特点',
      slogan: '专为创作者打造的全方位AI图像生成解决方案，让创意变现更简单',
      countSuffix: '项核心功能特性',
      feature1Title: '一键生成多风格图像',
      feature1Desc: '只需输入一句中文描述，选择一个风格模板，即可一键生成高质量AI图像，适配社交媒体、电商、教学等多场景。',
      feature2Title: '21+种专业模板风格',
      feature2Desc: '内置7类用户场景 × 每类3种风格模板，涵盖内容创作、情绪疗愈、品牌设计、教育插画等典型应用领域。',
      feature3Title: '中文智能优化 + 英文Prompt自动生成',
      feature3Desc: '系统支持中文输入，自动联动大语言模型进行提示词优化、意图识别与英文Prompt生成，无需用户懂英文。',
      feature4Title: '参数微调与高级Prompt自定义',
      feature4Desc: '支持基础参数调节（图像尺寸、风格强度等），也提供高级模式自定义Prompt，适合专业用户自由创作。',
      feature5Title: '图像实时预览与一键下载',
      feature5Desc: '每次生成默认提供4张预览图，支持点击放大查看、收藏、打标签和下载保存至本地或"我的作品"中。',
      feature6Title: '我的作品管理中心',
      feature6Desc: '登录后可查看生成记录，分类管理、打标签收藏，支持再次编辑与生成，打造个人专属创作空间。',
      feature7Title: '留言反馈机制',
      feature7Desc: '内置"给我留言"按钮，方便用户反馈问题或建议，由开发者定期集中回复，提升用户参与感与产品打磨效率。',
      feature8Title: '灵活的点数和会员制度',
      feature8Desc: '支持一次性点数包与会员订阅两种方式，适合不同使用频率的用户；新用户注册赠送免费点数体验。',
      whyTitle: '为什么选择 ARTBUD.SPACE',
      whyDesc: '我们致力于为每一位创作者提供最简单易用、功能强大的AI图像生成工具，\n无论您是社交媒体运营者、设计师、教师还是电商从业者，都能在这里找到适合的创作方案',
      why21: '专业风格模板',
      why10: '免费体验点数',
      why7: '应用场景覆盖',
      ctaTitle: '开启您的AI创作之旅',
      ctaDesc: '立即体验 ARTBUD.SPACE 的强大功能，用AI为您的创意插上翅膀',
      ctaStart: '立即开始创作',
      ctaPricing: '查看价格方案',
      backHome: '返回首页'
    },
    faq: {
      title: '常见问题',
      slogan: '快速找到您关心的问题解答，让您更好地使用 ARTBUD.SPACE AI图像生成工具',
      categories: [
        {
          title: '使用入门',
          icon: '🚀',
          color: 'from-blue-500 to-cyan-500',
          questions: [
            { q: '我该如何开始使用这款AI图像生成工具？', a: '只需打开网站，选择一个风格模板，输入中文描述，点击「立即生成」即可。新用户注册即可获得10点免费体验点数，无需安装App。' },
            { q: '支持中文输入吗？我不会写英文Prompt怎么办？', a: '完全支持中文输入！系统内置智能翻译和优化功能，会自动将您的中文描述转换为专业的英文Prompt，并进行AI优化，无需掌握英文提示词写法。' },
            { q: '为什么我点击生成后没反应或加载很久？', a: '可能原因：1）生成队列较多，请耐心等待；2）网络异常，建议刷新页面重试；3）点数不足，请检查账户余额。如持续无响应超过5分钟，请联系客服。' }
          ]
        },
        {
          title: '点数与付费',
          icon: '💰',
          color: 'from-green-500 to-emerald-500',
          questions: [
            { q: '每次点击生成需要消耗什么？是免费的吗？', a: '每次生成消耗1点数。新用户注册获得10点免费体验。之后可购买点数包：50点(¥15)、100点(¥27)、300点(¥75)，或订阅会员获得更多权益。' },
            { q: '点数包和会员订阅有什么区别？', a: '点数包：按使用量付费，适合偶尔使用。会员订阅：享受无限生成+专属模板+优先处理+高清导出等特权，适合频繁使用的创作者。' },
            { q: '是否支持退款或点数找回？', a: '虚拟点数一经使用不可退回。如遇系统异常导致多次失败扣点，可提供截图申请人工处理补点。' },
            { q: '支付安全吗？支持哪些支付方式？', a: '支持支付宝、微信支付，均采用官方安全支付通道，资金安全有保障。支付成功后点数立即到账，支持开具电子发票。' }
          ]
        },
        {
          title: '功能使用',
          icon: '🎨',
          color: 'from-purple-500 to-pink-500',
          questions: [
            { q: '我可以自定义风格或Prompt吗？', a: '支持两种模式：1）简单模式：选择风格模板+中文描述；2）高级模式：完全自定义Prompt、调节参数（图像尺寸、风格强度等）。' },
            { q: '为什么我看不到某些风格模板？', a: '部分高级模板仅对会员开放。免费用户可使用基础模板，会员可享受全部18+专业模板，包括商用级、艺术级等高端风格。' },
            { q: '生成的图像带有水印吗？', a: '所有用户生成的图像均为无水印高清版本。支持直接下载保存，可用于个人创作、社交分享等用途。' },
            { q: '如何提高生成效果？有什么技巧吗？', a: '1）描述要具体详细；2）选择合适的风格模板；3）开启AI优化功能；4）使用高级参数调节；5）多尝试不同的关键词组合。' }
          ]
        },
        {
          title: '作品管理',
          icon: '📁',
          color: 'from-orange-500 to-red-500',
          questions: [
            { q: '我生成的图像在哪里查看？可以保存吗？', a: '登录后，所有生成图像将自动保存在「我的作品」中。支持分类管理、添加标签、收藏、下载、分享，还可以基于历史作品重新生成。' },
            { q: '可以批量下载我的作品吗？', a: '支持！在「我的作品」页面，可以勾选多张图片进行批量操作：批量下载、批量收藏、批量添加标签或批量删除。' },
            { q: '作品会保存多久？会丢失吗？', a: '会员用户作品永久保存，免费用户保存90天。建议及时下载重要作品到本地。我们承诺不会删除付费用户的作品数据。' }
          ]
        },
        {
          title: '商用授权',
          icon: '📄',
          color: 'from-indigo-500 to-purple-500',
          questions: [
            { q: '生成的图像我可以商用吗？', a: '个人创作、社交分享完全免费。商业用途建议升级商用授权：会员用户享受基础商用权限，企业用户可申请扩展商用授权。' },
            { q: '如何获得商用授权证明？', a: '会员用户可在「我的作品」中为特定图片申请商用授权证明。企业用户可联系客服获得批量授权协议和授权书。' },
            { q: '商用时需要标注来源吗？', a: '个人使用无需标注。商业用途建议标注\'Generated by ARTBUD.SPACE\'，有助于获得更好的技术支持和优先服务。' }
          ]
        },
        {
          title: '技术支持',
          icon: '🛠️',
          color: 'from-teal-500 to-cyan-500',
          questions: [
            { q: '支持什么图像尺寸和格式？', a: '支持多种尺寸：方形(512×512)、横向(768×512)、竖向(512×768)。输出格式为高清PNG，支持下载为JPG。会员可享受更大尺寸选项。' },
            { q: '生成失败了怎么办？点数会被扣除吗？', a: '生成失败不会扣除点数。常见失败原因：描述包含违规内容、网络超时、服务器繁忙。系统会自动重试，失败后可免费重新生成。' },
            { q: '可以在手机上使用吗？', a: '完全支持！网站采用响应式设计，在手机、平板、电脑上均可正常使用。建议使用Chrome、Safari等现代浏览器获得最佳体验。' },
            { q: '如何联系客服或反馈问题？', a: '1）页面内「给我留言」按钮；\n2）发送邮件至support@artbud.space；' }
          ]
        }
      ]
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
      points: 'Points',
      image2image: 'Image2Image',
      imageExtend: 'Image Extend',
      tts: 'Text-to-Speech'
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
        title: '注册奖励',
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
      registerBonus: 'Register to get 10 points',
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
      seconds: 'Seconds',
      image2image: 'Image2Image'
    },
    growth: {
      thankYou: "Thank you for every creation. May AI add color to your inspiration!",
      milestone: (count: number) => `You have created ${count} works. Keep exploring more possibilities!`
    },
    features: {
      title: 'Features',
      slogan: 'A comprehensive AI image generation solution for creators, making creativity easier to realize',
      countSuffix: 'Core Features',
      feature1Title: 'One-click Multi-style Image Generation',
      feature1Desc: 'Just enter a Chinese description, select a style template, and you can generate high-quality AI images with one click, suitable for social media, e-commerce, education, and more.',
      feature2Title: '21+ Professional Style Templates',
      feature2Desc: 'Built-in 7 user scenarios × 3 style templates each, covering content creation, emotional healing, brand design, educational illustration, and more.',
      feature3Title: 'Chinese Optimization + English Prompt Generation',
      feature3Desc: 'The system supports Chinese input, automatically links with LLMs for prompt optimization, intent recognition, and English prompt generation. No need to know English.',
      feature4Title: 'Parameter Tuning & Advanced Prompt Customization',
      feature4Desc: 'Supports basic parameter adjustment (image size, style strength, etc.), and advanced mode for custom prompts, suitable for professional users.',
      feature5Title: 'Real-time Preview & One-click Download',
      feature5Desc: 'Each generation provides 4 preview images by default, supports zoom, favorite, tagging, and download to local or "My Works".',
      feature6Title: 'My Works Management Center',
      feature6Desc: 'View generation records after login, manage by category, tag, favorite, re-edit and generate, build your own creative space.',
      feature7Title: 'Feedback Mechanism',
      feature7Desc: 'Built-in "Contact Us" button for user feedback, regularly replied by developers to improve user engagement and product quality.',
      feature8Title: 'Flexible Points & Membership System',
      feature8Desc: 'Supports one-time points packs and membership subscriptions, suitable for different usage frequencies. New users get free points.',
      whyTitle: 'Why Choose ARTBUD.SPACE',
      whyDesc: 'We are committed to providing every creator with the simplest and most powerful AI image generation tool.\nWhether you are a social media operator, designer, teacher, or e-commerce practitioner, you can find a suitable solution here.',
      why21: 'Professional Style Templates',
      why10: 'Free Experience Points',
      why7: 'Application Scenarios',
      ctaTitle: 'Start Your AI Creation Journey',
      ctaDesc: 'Experience the power of ARTBUD.SPACE now and let AI give wings to your creativity',
      ctaStart: 'Start Creating',
      ctaPricing: 'View Pricing',
      backHome: 'Back to Home'
    },
    faq: {
      title: 'FAQs',
      slogan: 'Quickly find answers to your questions and use ARTBUD.SPACE AI image generation tools better',
      categories: [
        {
          title: 'Getting Started',
          icon: '🚀',
          color: 'from-blue-500 to-cyan-500',
          questions: [
            { q: 'How do I start using this AI image generation tool?', a: 'Just open the website, select a style template, enter a Chinese description, and click "Generate Now". New users get 10 free experience points, no app installation required.' },
            { q: 'Does it support Chinese input? What if I can\'t write English prompts?', a: 'Fully supports Chinese input! The system has built-in intelligent translation and optimization, which will automatically convert your Chinese description into a professional English prompt and optimize it with AI. No need to master English prompt writing.' },
            { q: 'Why is there no response or a long wait after I click generate?', a: 'Possible reasons: 1) The generation queue is long, please be patient; 2) Network issues, try refreshing the page; 3) Insufficient points, please check your account balance. If there is still no response after more than 5 minutes, please contact customer service.' }
          ]
        },
        {
          title: 'Points & Payment',
          icon: '💰',
          color: 'from-green-500 to-emerald-500',
          questions: [
            { q: 'What does each generation cost? Is it free?', a: 'Each generation costs 1 point. New users get 10 free experience points. Afterwards, you can buy point packs: 50 points (¥15), 100 points (¥27), 300 points (¥75), or subscribe for more benefits.' },
            { q: 'What\'s the difference between point packs and membership?', a: 'Point packs: pay per use, suitable for occasional users. Membership: unlimited generation, exclusive templates, priority processing, HD export, etc., suitable for frequent creators.' },
            { q: 'Can I get a refund or recover points?', a: 'Virtual points are non-refundable once used. If multiple points are deducted due to system errors, you can provide screenshots to apply for manual compensation.' },
            { q: 'Is payment secure? What payment methods are supported?', a: 'Supports Alipay and WeChat Pay, both use official secure payment channels, and funds are safe. Points are credited immediately after payment, and electronic invoices are supported.' }
          ]
        },
        {
          title: 'Feature Usage',
          icon: '🎨',
          color: 'from-purple-500 to-pink-500',
          questions: [
            { q: 'Can I customize styles or prompts?', a: 'Supports two modes: 1) Simple mode: select a style template + Chinese description; 2) Advanced mode: fully customize prompts and adjust parameters (image size, style strength, etc.).' },
            { q: 'Why can\'t I see some style templates?', a: 'Some advanced templates are only available to members. Free users can use basic templates, members can enjoy all 21+ professional templates, including commercial and artistic high-end styles.' },
            { q: 'Are generated images watermarked?', a: 'All user-generated images are HD and watermark-free. You can download and use them for personal creation and social sharing.' },
            { q: 'How to improve generation results? Any tips?', a: '1) Be specific and detailed in your description; 2) Choose the right style template; 3) Enable AI optimization; 4) Use advanced parameter tuning; 5) Try different keyword combinations.' }
          ]
        },
        {
          title: 'Works Management',
          icon: '📁',
          color: 'from-orange-500 to-red-500',
          questions: [
            { q: 'Where can I view my generated images? Can I save them?', a: 'After login, all generated images are automatically saved in "My Works". Supports category management, tagging, favoriting, downloading, sharing, and re-generation based on history.' },
            { q: 'Can I batch download my works?', a: 'Yes! On the "My Works" page, you can select multiple images for batch operations: batch download, batch favorite, batch tag, or batch delete.' },
            { q: 'How long are works saved? Will they be lost?', a: 'Works are saved permanently for members, and 90 days for free users. It is recommended to download important works in time. We promise not to delete paid users\' work data.' }
          ]
        },
        {
          title: 'Commercial License',
          icon: '📄',
          color: 'from-indigo-500 to-purple-500',
          questions: [
            { q: 'Can I use generated images commercially?', a: 'Personal creation and social sharing are completely free. For commercial use, it is recommended to upgrade to a commercial license: members enjoy basic commercial rights, and enterprise users can apply for extended commercial licenses.' },
            { q: 'How to get a commercial license certificate?', a: 'Members can apply for a commercial license certificate for specific images in "My Works". Enterprise users can contact customer service for batch license agreements and certificates.' },
            { q: 'Do I need to credit the source for commercial use?', a: 'No credit is required for personal use. For commercial use, it is recommended to credit "Generated by ARTBUD.SPACE" to get better technical support and priority service.' }
          ]
        },
        {
          title: 'Technical Support',
          icon: '🛠️',
          color: 'from-teal-500 to-cyan-500',
          questions: [
            { q: 'What image sizes and formats are supported?', a: 'Supports multiple sizes: square (512×512), landscape (768×512), portrait (512×768). Output is HD PNG, supports download as JPG. Members can enjoy larger size options.' },
            { q: 'What if generation fails? Will points be deducted?', a: 'No points will be deducted for failed generations. Common reasons: description contains prohibited content, network timeout, server busy. The system will automatically retry, and you can regenerate for free after failure.' },
            { q: 'Can I use it on my phone?', a: 'Fully supported! The website is responsive and works on mobile, tablet, and desktop. It is recommended to use modern browsers like Chrome and Safari for the best experience.' },
            { q: 'How to contact customer service or give feedback?', a: '1) "Contact Us" button on the page;\n2) Email support@artbud.space;' }
          ]
        }
      ]
    }
  }
};

export function getTranslations(locale: Locale) {
  return translations[locale];
} 