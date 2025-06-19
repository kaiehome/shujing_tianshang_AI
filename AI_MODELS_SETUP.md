# AI 多模型集成配置指南

## 概述

本应用已集成多个大模型，实现多步骤的提示词优化与多模型图像生成：

1. **DeepSeek** - 分析结构，提取主题/情绪/风格关键词
2. **通义（Tongyi）** - 优化文艺化描述
3. **DeepSeek** - 翻译英文并进行风格补全
4. **通义万相**（默认）/ **豆包**（即将开放）- 图像生成

## API 配置

### 1. 通义（Tongyi）
- **API Key**: `sk-ade7e6a1728741fcb009dcf1419000de`
- **端点**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- **模型**: `qwen-plus`

### 2. DeepSeek
- **API Key**: `sk-248ed291fe8148098d684c84183d4532`
- **端点**: `https://api.deepseek.com/v1/chat/completions`
- **模型**: `deepseek-chat`

### 3. 豆包 (Doubao)
- **API Key**: `7f11c50c-456b-46d1-aa7f-bf13b66fc17a`
- **端点**: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
- **模型**: `doubao-1-5-pro-32k-250115`

### 4. 通义万相（图像生成）
- **API Key**: `sk-ade7e6a1728741fcb009dcf1419000de`
- **端点**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis`

## 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```bash
# 大模型API配置
TONGYI_API_KEY=sk-ade7e6a1728741fcb009dcf1419000de
TONGYI_WANXIANG_API_KEY=sk-ade7e6a1728741fcb009dcf1419000de
DEEPSEEK_API_KEY=sk-248ed291fe8148098d684c84183d4532
DOUBAO_API_KEY=7f11c50c-456b-46d1-aa7f-bf13b66fc17a
```

## 工作流程

### 多步骤优化与图像生成流程

当用户输入中文提示词时，系统会自动执行以下步骤：

1. **DeepSeek分析** (25% 进度)
   - 分析用户输入的中文描述
   - 提取主题、情绪和风格关键词
   - 输出简洁的关键词列表

2. **通义润色** (60% 进度)
   - 接收关键词列表
   - 转化为优美、文艺的中文描述
   - 增强画面感和艺术性

3. **DeepSeek翻译** (80% 进度)
   - 将优化后的中文描述翻译为英文
   - 根据选定风格添加艺术描述词汇
   - 生成适合AI图像生成的英文提示词

4. **图像生成** (100% 进度)
   - 使用优化后的英文提示词
   - 默认调用通义万相API生成图像
   - 前端支持模型选择（通义万相/豆包），但豆包暂未开放，选项置灰

### 错误处理

- 如果AI优化失败，系统会自动回退到基础翻译
- 如果基础翻译也失败，会使用原始提示词
- 每个步骤都有超时保护
- 支持取消正在进行的优化过程

## 前端界面

- **实时进度显示**: 显示当前优化步骤和进度百分比
- **步骤可视化**: DeepSeek分析 → 通义润色 → DeepSeek翻译
- **结果预览**: 显示AI优化后的最终提示词
- **模型选择**: 支持通义万相/豆包切换（豆包暂不可用）
- **智能回退**: 优化失败时自动使用备用方案

## 技术实现

### 核心文件

- `app/lib/ai.ts` - 主要的AI集成逻辑
- `app/components/GenerationForm.tsx` - 前端生成表单
- `app/api/generate/route.ts` - 图像生成API分流

### API调用架构

```typescript
// 通用API调用函数
async function callLLMAPI(
  modelType: 'tongyi' | 'deepseek' | 'doubao',
  messages: Array<{ role: string; content: string }>,
  timeout: number = 30000
): Promise<string>

// 多步骤优化流程
export async function optimizePrompt(
  chinesePrompt: string,
  style: Style,
  onProgress?: (step: string, progress: number) => void
): Promise<string>
```

## 故障排除

- **API密钥错误**: 检查环境变量配置是否正确
- **网络超时**: 检查网络连接，API服务是否可用
- **优化失败**: 系统会自动回退到基础翻译
- **进度卡住**: 刷新页面重新开始

## 更新日志

### v1.1.0
- ✅ DeepSeek分析、通义润色、DeepSeek翻译新流程
- ✅ 图像生成支持通义万相/豆包模型切换（豆包暂不可用）
- ✅ 前端模型选择联动

### v1.0.0
- ✅ 集成通义千问、DeepSeek、豆包三个大模型（旧流程）
- ✅ 实现多步骤提示词优化流程
- ✅ 添加实时进度显示和错误处理
- ✅ 支持智能回退机制
- ✅ 优化用户界面和体验

## 安全注意事项

- API密钥建议在生产环境中使用环境变量
- 所有API调用都有超时保护，防止长时间等待
- 用户输入会经过验证和清理，防止恶意注入

## 联系支持

如有问题或建议，请联系开发团队。 