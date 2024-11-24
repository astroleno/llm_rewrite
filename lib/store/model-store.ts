import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ModelConfig, SystemPrompt, ModelResponse } from '../types'

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
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      models: [],
      useUnifiedPrompt: true,
      unifiedSystemPrompt: '',
      userPrompt: '',
      responses: [],
      systemPrompts: [],

      addModel: () => set((state) => ({
        models: [...state.models, {
          id: crypto.randomUUID(),
          modelType: '',
          apiKey: '',
          provider: 'xi-ai',
          proxyUrl: 'https://api.xi-ai.cn/v1/chat/completions',
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