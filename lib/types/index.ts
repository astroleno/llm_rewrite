export interface ModelConfig {
  id: string
  modelType: string
  apiKey?: string
  provider: ApiProvider
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
      reasoning?: string
    }
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    completion_tokens_details?: {
      function_tokens?: number
      system_tokens?: number
      user_tokens?: number
      assistant_tokens?: number
    }
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ModelResponse {
  modelId: string
  response: string
  error?: string
  reasoning?: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
    completion_tokens_details?: {
      function_tokens?: number
      system_tokens?: number
      user_tokens?: number
      assistant_tokens?: number
    }
  }
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
  // CyberMuggles 模型
  {
    id: 'GeminiMIXR1',
    name: 'GeminiMIXR1',
    description: 'CyberMuggles G&R GeminiMIXR1',
    provider: 'cybermuggles'
  },
  // Siliconflow 模型
  {
    id: 'deepseek-ai/DeepSeek-R1',
    name: 'DeepSeek-R1',
    description: 'Pro/deepseek-ai/DeepSeek-R1',
    provider: 'siliconflow'
  },
  // Yunwu 模型
  {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro',
    description: 'Gemini 2.0 Pro Exp 02-05',
    provider: 'yunwu'
  },
  {
    id: 'gemini-2.0-flash-thinking-exp-01-21',
    name: 'Gemini 2.0 Flash',
    description: 'Gemini 2.0 Flash Thinking Exp 01-21',
    provider: 'yunwu'
  },
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
    id: 'cybermuggles',
    name: 'CyberMuggles G&R',
    url: 'http://124.222.75.42:4120'
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    url: 'https://api.siliconflow.cn'
  },
  {
    id: 'yunwu',
    name: 'YunWu',
    url: 'https://yunwu.ai'
  },
  {
    id: 'custom',
    name: '自定义',
    url: ''
  }
] as const

export type ApiProvider = typeof API_PROVIDERS[number]['id']

export interface SystemPrompt {
  id: string
  name: string
  content: string
}

export interface SiliconflowRequestBody {
  model: string
  messages: {
    role: 'system' | 'user' | 'assistant'
    content: string
  }[]
  stream: boolean
  max_tokens: number
  stop: string[]
  temperature: number
  top_p: number
  top_k: number
  frequency_penalty: number
  n: number
  response_format: {
    type: string
  }
  tools: {
    type: string
    function: {
      description: string
      name: string
      parameters: Record<string, any>
      strict: boolean
    }
  }[]
}