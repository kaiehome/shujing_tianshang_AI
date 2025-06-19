# 🚀 传统 Gradio Space 部署指南

## 🎯 目标

部署一个支持标准 `/run/predict` POST 接口的传统 Gradio 应用，替代 SvelteKit SSR 部署。

## 📋 准备工作

### 1. 文件清单
我已经为您准备了以下文件：

```
gradio_space_config/
├── app.py              # 主应用文件
├── requirements.txt    # 依赖文件
└── README.md          # Space 说明文档
```

### 2. 核心特性
- ✅ **标准 Gradio 接口**：支持 `/run/predict` POST 端点
- ✅ **Stable Diffusion XL**：高质量图像生成
- ✅ **完整参数控制**：CFG、步数、尺寸、种子等
- ✅ **批量生成**：一次生成 1-4 张图像
- ✅ **内存优化**：GPU/CPU 自适应

## 🔧 部署步骤

### 步骤 1: 创建 Hugging Face Space

1. **访问 Hugging Face Spaces**
   ```
   https://huggingface.co/spaces
   ```

2. **点击 "Create new Space"**

3. **配置 Space 信息**
   - **Space name**: `ai-image-generator` (或您喜欢的名称)
   - **License**: `Apache 2.0`
   - **SDK**: `Gradio`
   - **Hardware**: `CPU basic` (免费) 或 `T4 small` (付费，更快)
   - **Visibility**: `Public` 或 `Private`

### 步骤 2: 上传文件

1. **上传 `app.py`**
   - 复制 `gradio_space_config/app.py` 的内容
   - 在 Space 中创建 `app.py` 文件并粘贴

2. **上传 `requirements.txt`**
   - 复制 `gradio_space_config/requirements.txt` 的内容
   - 在 Space 中创建 `requirements.txt` 文件并粘贴

3. **更新 `README.md`**
   - 复制 `gradio_space_config/README.md` 的内容
   - 更新 Space 的 README.md

### 步骤 3: 等待构建

Space 会自动开始构建，这个过程可能需要 5-10 分钟：

1. **依赖安装**: 安装 PyTorch、Diffusers 等
2. **模型下载**: 下载 Stable Diffusion XL 模型
3. **应用启动**: 启动 Gradio 服务

### 步骤 4: 测试 API

构建完成后，您的 Space URL 将是：
```
https://your-username-ai-image-generator.hf.space
```

测试 API 端点：
```bash
curl -X POST https://your-username-ai-image-generator.hf.space/run/predict \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      "a beautiful landscape with mountains and sunset, highly detailed, photorealistic",
      "low quality, blurry, distorted, bad anatomy, worst quality",
      7.5,
      28,
      1024,
      1024,
      -1,
      4
    ]
  }'
```

## 🔄 更新应用配置

### 步骤 5: 更新本地配置

在您的应用中更新 HF Space 配置：

```typescript
// app/api/generate/route.ts
const HF_SPACE_CONFIG = {
  name: 'Your Custom Space',
  wsUrl: 'wss://your-username-ai-image-generator.hf.space/queue/join',
  apiUrl: 'https://your-username-ai-image-generator.hf.space/run/predict',
  priority: 1,
  isSvelteKit: false, // 🔥 重要：设置为 false
  disabled: false     // 🔥 重要：启用您的 Space
}
```

### 步骤 6: 测试集成

重启您的本地开发服务器并测试：

```bash
# 测试图像生成 API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "beautiful sunset landscape"}'
```

## 📊 性能对比

| 特性 | SvelteKit Space | 传统 Gradio Space |
|------|----------------|-------------------|
| **API 兼容性** | ❌ 不兼容 | ✅ 完全兼容 |
| **部署复杂度** | 🔴 复杂 | 🟢 简单 |
| **调试难度** | 🔴 困难 | 🟢 容易 |
| **文档支持** | 🟡 有限 | 🟢 完整 |
| **社区支持** | 🟡 较少 | 🟢 丰富 |

## 🎨 自定义选项

### 模型选择
您可以在 `app.py` 中更换不同的模型：

```python
# 选择不同的 Stable Diffusion 模型
model_options = {
    "SDXL Base": "stabilityai/stable-diffusion-xl-base-1.0",
    "SDXL Turbo": "stabilityai/sdxl-turbo",
    "SD 2.1": "stabilityai/stable-diffusion-2-1",
    "Realistic Vision": "SG161222/Realistic_Vision_V6.0_B1_noVAE"
}
```

### 参数调整
根据需要调整默认参数：

```python
# 在 generate_images 函数中调整默认值
def generate_images(
    prompt: str,
    negative_prompt: str = "low quality, blurry",
    guidance_scale: float = 7.5,    # CFG 强度
    num_inference_steps: int = 28,  # 推理步数
    width: int = 1024,              # 图像宽度
    height: int = 1024,             # 图像高度
    seed: int = -1,                 # 随机种子
    num_outputs: int = 4            # 生成数量
):
```

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   - 检查 `requirements.txt` 格式
   - 确保所有依赖版本兼容

2. **内存不足**
   - 升级到 GPU 硬件
   - 减少 `num_outputs` 参数

3. **模型加载慢**
   - 首次运行需要下载模型
   - 后续运行会使用缓存

4. **API 调用失败**
   - 检查 Space 是否正在运行
   - 验证 URL 和参数格式

### 调试技巧

1. **查看日志**
   - 在 Space 页面查看构建和运行日志
   - 使用 `logger.info()` 添加调试信息

2. **测试本地**
   - 在本地运行 `app.py` 进行测试
   - 使用 `gradio app.py` 命令

3. **API 文档**
   - 访问 `https://your-space-url/docs` 查看 API 文档
   - 使用 Gradio 内置的 API 测试工具

## 🎉 完成！

现在您有了一个完全兼容的传统 Gradio Space，支持标准的 `/run/predict` POST 接口！

### 优势总结
- ✅ **完全兼容**: 支持所有标准 Gradio API
- ✅ **易于维护**: 简单的 Python 代码
- ✅ **丰富文档**: 完整的 API 文档
- ✅ **社区支持**: 大量教程和示例
- ✅ **高性能**: 优化的模型加载和推理

### 下一步
- 🔧 根据需要自定义模型和参数
- 📊 监控 Space 的使用情况和性能
- 🚀 考虑升级到更强大的 GPU 硬件
- 🎨 添加更多功能和模型选择

---

**🎊 恭喜！您现在拥有了一个功能完整的 AI 图像生成服务！** 