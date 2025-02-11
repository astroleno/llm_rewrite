# AI Model Comparison Tool (AI模型对比工具)

这是一个基于 Next.js 开发的 AI 模型对比工具，允许用户同时测试和比较多个大语言模型的响应。

## 主要特性

### 1. 多模型支持
- 支持多个 AI 服务提供商:
  - CyberMuggles G&R
  - SiliconFlow
  - YunWu
  - 自定义提供商
- 灵活的模型配置
  - 预设模型类型
  - 自定义模型支持
  - API Key 管理
  - 代理 URL 配置

### 2. Prompt 管理系统
- System Prompt 管理
  - 支持统一 Prompt 模式
  - 支持个性化 Prompt 设置
  - Prompt 模板管理
- 灵活的用户输入
  - 支持多行文本输入
  - Markdown 格式支持

### 3. 响应展示
- 并行请求处理
- 实时响应显示
- 错误处理和提示
- Token 使用统计
- 响应对比视图

### 4. 安全特性
- API Key 加密存储
- 页面刷新时清空敏感信息
- 认证码系统用于自动填充

## 快速开始

1. 安装依赖
bash
npm install

2. 配置环境变量
创建 `.env.local` 文件并配置以下变量:
NEXT_PUBLIC_AUTH_CODE=your_auth_code
NEXT_PUBLIC_CYBERMUGGLES_API_KEY=your_cybermuggles_key
NEXT_PUBLIC_SILICONFLOW_API_KEY=your_siliconflow_key
NEXT_PUBLIC_YUNWU_API_KEY=your_yunwu_key

3. 启动开发服务器

bash
npm run dev

## 使用指南

### 添加新模型
1. 点击"添加模型"按钮
2. 选择 API 提供商
3. 选择或自定义模型类型
4. 配置 API Key
5. 设置 System Prompt

### 发送请求
1. 在 Prompt 输入框中输入问题
2. 点击"发送请求"按钮
3. 查看各个模型的响应结果

### API Key 管理
- 手动输入: 直接在对应输入框中输入
- 自动填充: 使用认证码一键填充所有 API Key

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- React Markdown

## 项目结构

src/
├── app/ # Next.js 应用入口
├── components/ # React 组件
│ ├── model-config/ # 模型配置相关组件
│ ├── prompt/ # Prompt 管理组件
│ ├── response/ # 响应展示组件
│ └── ui/ # 通用 UI 组件
├── lib/ # 工具函数和类型定义
│ ├── store/ # 状态管理
│ ├── types/ # TypeScript 类型定义
│ └── utils/ # 工具函数
└── styles/ # 样式文件


## 开发计划

- [ ] 添加更多模型供应商支持
- [ ] 实现对话历史记录
- [ ] 添加响应结果导出功能
- [ ] 优化响应性能
- [ ] 添加更多自定义选项

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License