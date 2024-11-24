# AI Model Comparison Tool

这是一个基于 Next.js 开发的 AI 模型对比工具，允许用户同时测试和比较多个大语言模型的响应。

## 功能特点

1. 模型配置管理
   - 支持添加多个 AI 模型配置
   - 每个模型配置包含：
     - 模型类型选择
     - API Key 配置
     - 代理 URL 设置（可选）

2. Prompt 管理
   - System Role Prompt 配置
     - 支持统一 Prompt 模式
     - 支持个性化 Prompt 模式
   - User Role Prompt 输入
   - 支持 Markdown 格式的响应展示

3. 界面布局
   - 响应式设计
   - 并排展示不同模型的结果
   - 结果支持折叠/展开
   - 清晰的视觉分隔

## 技术栈

- Next.js 14 (App Router)
- React 18.2.0
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- React Icons
- React Markdown

## 项目结构

src/
├