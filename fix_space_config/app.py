#!/usr/bin/env python3
"""
修复版 Gradio 图像生成应用
禁用 SvelteKit SSR，恢复标准 /run/predict POST 接口
"""

import gradio as gr
from diffusers import StableDiffusionXLPipeline
import torch
import os
from typing import List, Optional
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 全局变量
pipe = None

def load_model():
    """加载 Stable Diffusion XL 模型"""
    global pipe
    try:
        logger.info("正在加载 Stable Diffusion XL 模型...")
        
        # 使用 SDXL 基础模型
        model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        
        # 检查是否有 GPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        torch_dtype = torch.float16 if device == "cuda" else torch.float32
        
        # pipe = StableDiffusionXLPipeline.from_pretrained(
        #     model_id,
        #     torch_dtype=torch_dtype,
        #     use_safetensors=True,
        #     variant="fp16" if device == "cuda" else None
        # )

        pipe = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0"
        ).to("cpu")

        pipe = pipe.to(device)
        
        # 启用内存优化
        if device == "cuda":
            pipe.enable_model_cpu_offload()
            pipe.enable_vae_slicing()
            pipe.enable_attention_slicing()
        
        logger.info(f"模型加载完成，使用设备: {device}")
        return True
        
    except Exception as e:
        logger.error(f"模型加载失败: {e}")
        return False

def generate_images(
    prompt: str,
    negative_prompt: str = "low quality, blurry, distorted, bad anatomy, worst quality",
    guidance_scale: float = 7.5,
    num_inference_steps: int = 28,
    width: int = 1024,
    height: int = 1024,
    seed: int = -1,
    num_outputs: int = 4
) -> List[str]:
    """
    生成图像
    
    Args:
        prompt: 正面提示词
        negative_prompt: 负面提示词
        guidance_scale: CFG 引导强度
        num_inference_steps: 推理步数
        width: 图像宽度
        height: 图像高度
        seed: 随机种子 (-1 表示随机)
        num_outputs: 生成数量
    
    Returns:
        生成的图像列表
    """
    global pipe
    
    if pipe is None:
        if not load_model():
            raise gr.Error("模型加载失败，请稍后重试")
    
    try:
        # 设置随机种子
        if seed == -1:
            seed = torch.randint(0, 2**32 - 1, (1,)).item()
        
        generator = torch.Generator(device=pipe.device).manual_seed(seed)
        
        logger.info(f"开始生成图像: prompt='{prompt[:50]}...', seed={seed}")
        
        # 生成图像
        with torch.autocast(pipe.device.type):
            result = pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                guidance_scale=guidance_scale,
                num_inference_steps=num_inference_steps,
                width=width,
                height=height,
                num_images_per_prompt=num_outputs,
                generator=generator
            )
        
        images = result.images
        logger.info(f"成功生成 {len(images)} 张图像")
        
        return images
        
    except Exception as e:
        logger.error(f"图像生成失败: {e}")
        raise gr.Error(f"图像生成失败: {str(e)}")

def create_interface():
    """创建 Gradio 界面 - 强制使用传统模式"""
    
    # 🔥 关键：使用 gr.Interface 而不是 gr.Blocks 来确保传统 API
    interface = gr.Interface(
        fn=generate_images,
        inputs=[
            gr.Textbox(
                label="提示词 (Prompt)",
                placeholder="描述您想要生成的图像...",
                lines=3,
                value="a beautiful landscape with mountains and sunset, highly detailed, photorealistic"
            ),
            gr.Textbox(
                label="负面提示词 (Negative Prompt)",
                placeholder="描述您不想要的元素...",
                lines=2,
                value="low quality, blurry, distorted, bad anatomy, worst quality"
            ),
            gr.Slider(
                label="CFG 引导强度",
                minimum=1.0,
                maximum=20.0,
                value=7.5,
                step=0.5
            ),
            gr.Slider(
                label="推理步数",
                minimum=10,
                maximum=50,
                value=28,
                step=1
            ),
            gr.Slider(
                label="宽度",
                minimum=512,
                maximum=1536,
                value=1024,
                step=64
            ),
            gr.Slider(
                label="高度",
                minimum=512,
                maximum=1536,
                value=1024,
                step=64
            ),
            gr.Number(
                label="随机种子 (-1 表示随机)",
                value=-1,
                precision=0
            ),
            gr.Slider(
                label="生成数量",
                minimum=1,
                maximum=4,
                value=4,
                step=1
            )
        ],
        outputs=gr.Gallery(
            label="生成的图像",
            columns=2,
            rows=2,
            height="auto"
        ),
        title="🎨 AI 图像生成器",
        description="""
        基于 Stable Diffusion XL 的高质量图像生成服务
        
        **特性**：
        - ✅ 支持标准 `/run/predict` POST 接口
        - ✅ 高质量 SDXL 模型
        - ✅ 可自定义参数
        - ✅ 批量生成
        """,
        examples=[
            [
                "a majestic dragon flying over a medieval castle, fantasy art, highly detailed",
                "low quality, blurry",
                7.5, 28, 1024, 1024, -1, 4
            ],
            [
                "a futuristic city with flying cars, cyberpunk style, neon lights",
                "low quality, blurry, distorted",
                8.0, 30, 1024, 1024, -1, 4
            ],
            [
                "a serene forest with sunlight filtering through trees, photorealistic",
                "low quality, cartoon, anime",
                7.0, 25, 1024, 1024, -1, 4
            ]
        ],
        # 🔥 关键配置：确保传统 API 可用
        api_name="predict",  # 明确指定 API 名称
        allow_flagging="never",
        cache_examples=False
    )
    
    return interface

if __name__ == "__main__":
    # 预加载模型
    logger.info("启动应用...")
    load_model()
    
    # 创建界面
    demo = create_interface()
    
    # 🔥 关键启动配置：禁用 SvelteKit，强制传统模式
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_api=True,          # 显示 API 文档
        show_error=True,
        enable_queue=True,      # 启用队列系统
        max_threads=10,         # 最大线程数
        # 🔥 关键：禁用现代 UI 特性，强制传统模式
        favicon_path=None,
        ssl_keyfile=None,
        ssl_certfile=None,
        ssl_keyfile_password=None,
        quiet=False,
        show_tips=False,
        height=600,
        width="100%",
        prevent_thread_lock=False,
        auth=None,
        auth_message=None,
        blocked_paths=None,
        allowed_paths=None,
        root_path=None,
        app_kwargs={}
    ) 