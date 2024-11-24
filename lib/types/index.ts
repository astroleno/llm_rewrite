export interface ModelConfig {
  id: string
  modelType: string
  apiKey: string
  provider: typeof API_PROVIDERS[number]['id']
  proxyUrl?: string
  systemPromptId?: string
  systemPrompt?: string
}

export interface XiApiRequestBody {
  model: string
  messages: {
    role: 'system' | 'user' | 'assistant'
    content: string
  }[]
  temperature?: number
  max_tokens?: number
}

export interface XiApiResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ModelResponse {
  modelId: string
  response: string
  error?: string
}

export interface ApiResponse {
  choices: {
    message: {
      content: string
    }
  }[]
  error?: {
    message: string
  }
}

export const MODEL_PRESETS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4O',
    description: 'OpenAI GPT-4 Turbo',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4O Mini',
    description: 'OpenAI GPT-4 Turbo Mini',
  },
  {
    id: 'o1-preview',
    name: 'O1 Preview',
    description: 'O1 Preview Model',
  },
  {
    id: 'o1-mini',
    name: 'O1 Mini',
    description: 'O1 Mini Model',
  },
  {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet (2024.06.20)',
    description: 'Anthropic Claude 3.5 Sonnet (June 2024)',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet (2024.10.22)',
    description: 'Anthropic Claude 3.5 Sonnet (October 2024)',
  },
] as const

export type ModelPresetId = typeof MODEL_PRESETS[number]['id']

export const API_PROVIDERS = [
  {
    id: 'xi-ai',
    name: 'Xi-AI',
    url: 'https://api.xi-ai.cn/v1/chat/completions'
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    url: 'https://api.siliconflow.cn/v1/chat/completions'
  },
  {
    id: 'yunwu',
    name: 'YunWu',
    url: 'https://api.wlai.vip/v1/chat/completions'
  },
  {
    id: 'custom',
    name: '自定义',
    url: ''
  }
] as const

export interface SystemPrompt {
  id: string
  name: string
  content: string
}