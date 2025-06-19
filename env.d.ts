declare namespace NodeJS {
  interface ProcessEnv {
    // AI模型API密钥
    REPLICATE_API_TOKEN: string;
    TONGYI_API_KEY: string;
    DEEPSEEK_API_KEY: string;
    DOUBAO_API_KEY: string;
    
    // 图像生成API密钥
    HF_API_KEY: string;           // Hugging Face API密钥
    STABILITY_API_KEY: string;    // Stability AI API密钥
  }
} 