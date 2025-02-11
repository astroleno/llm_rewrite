import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ModelConfig, SystemPrompt, ModelResponse } from '../types'

const DEFAULT_MODEL: ModelConfig = {
  id: '1',
  provider: 'cybermuggles',
  modelType: 'GeminiMIXR1',
  proxyUrl: 'http://124.222.75.42:4120/v1/chat/completions'
}

interface ModelStore {
  // 状态
  models: ModelConfig[]
  useUnifiedPrompt: boolean
  unifiedSystemPrompt: string
  userPrompt: string
  responses: ModelResponse[]
  
  // 新增状态
  systemPrompts: SystemPrompt[]
  
  // 操作方法
  addModel: () => void
  removeModel: (id: string) => void
  updateModel: (id: string, updates: Partial<ModelConfig>) => void
  setUseUnifiedPrompt: (value: boolean) => void
  setUnifiedSystemPrompt: (prompt: string) => void
  setUserPrompt: (prompt: string) => void
  setResponse: (response: ModelResponse) => void
  clearResponses: () => void
  
  // 新增方法
  addSystemPrompt: (name: string, content: string) => void
  updateSystemPrompt: (id: string, updates: Partial<SystemPrompt>) => void
  removeSystemPrompt: (id: string) => void
  
  authCode: string
  setAuthCode: (code: string) => void
  autoFillAllApiKeys: () => void
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      models: [DEFAULT_MODEL],
      useUnifiedPrompt: true,
      unifiedSystemPrompt: '',
      userPrompt: '',
      responses: [],
      systemPrompts: [],
      authCode: '',

      addModel: () => set((state) => ({
        models: [...state.models, {
          id: crypto.randomUUID(),
          modelType: '',
          apiKey: '',
          provider: 'cybermuggles',
          proxyUrl: 'http://124.222.75.42:4120/v1/chat/completions',
        }]
      })),

      removeModel: (id) => set((state) => ({
        models: state.models.filter(model => model.id !== id)
      })),

      updateModel: (id, updates) => set((state) => ({
        models: state.models.map(model => 
          model.id === id ? { ...model, ...updates } : model
        )
      })),

      setUseUnifiedPrompt: (value) => set({ useUnifiedPrompt: value }),
      
      setUnifiedSystemPrompt: (prompt) => set({ unifiedSystemPrompt: prompt }),
      
      setUserPrompt: (prompt) => set({ userPrompt: prompt }),
      
      setResponse: (response) => set((state) => ({
        responses: [
          ...state.responses.filter(r => r.modelId !== response.modelId),
          response
        ]
      })),
      
      clearResponses: () => set({ responses: [] }),
      
      addSystemPrompt: (name, content) => set((state) => ({
        systemPrompts: [...state.systemPrompts, {
          id: crypto.randomUUID(),
          name,
          content
        }]
      })),
      
      updateSystemPrompt: (id, updates) => set((state) => ({
        systemPrompts: state.systemPrompts.map(prompt =>
          prompt.id === id ? { ...prompt, ...updates } : prompt
        )
      })),
      
      removeSystemPrompt: (id) => set((state) => ({
        systemPrompts: state.systemPrompts.filter(prompt => prompt.id !== id)
      })),

      setAuthCode: (code) => set({ authCode: code }),
      
      autoFillAllApiKeys: () => {
        const { models } = get()
        const authCode = prompt('请输入认证码以自动填充所有 API Key:')
        
        if (!authCode) return
        
        if (authCode !== process.env.NEXT_PUBLIC_AUTH_CODE) {
          alert('认证码错误')
          return
        }
        
        const updatedModels = models.map(model => {
          let apiKey = null
          switch (model.provider) {
            case 'cybermuggles':
              apiKey = process.env.NEXT_PUBLIC_CYBERMUGGLES_API_KEY
              break
            case 'siliconflow':
              apiKey = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY
              break
            case 'yunwu':
              apiKey = process.env.NEXT_PUBLIC_YUNWU_API_KEY
              break
            default:
              return model
          }
          return apiKey ? { ...model, apiKey } : model
        })
        
        set({ models: updatedModels })
        alert('所有 API Key 已自动填充')
      },

      autoFillApiKey: undefined,
    }),
    {
      name: 'model-store',
      partialize: (state) => ({
        models: state.models,
        useUnifiedPrompt: state.useUnifiedPrompt,
        unifiedSystemPrompt: state.unifiedSystemPrompt,
        systemPrompts: state.systemPrompts,
      }),
    }
  )
) 