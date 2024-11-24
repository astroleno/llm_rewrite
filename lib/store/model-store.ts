import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ModelConfig, ModelResponse } from '../types'

interface ModelStore {
  // 状态
  models: ModelConfig[]
  useUnifiedPrompt: boolean
  unifiedSystemPrompt: string
  userPrompt: string
  responses: ModelResponse[]
  
  // 操作方法
  addModel: () => void
  removeModel: (id: string) => void
  updateModel: (id: string, updates: Partial<ModelConfig>) => void
  setUseUnifiedPrompt: (value: boolean) => void
  setUnifiedSystemPrompt: (prompt: string) => void
  setUserPrompt: (prompt: string) => void
  setResponse: (response: ModelResponse) => void
  clearResponses: () => void
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      models: [],
      useUnifiedPrompt: true,
      unifiedSystemPrompt: '',
      userPrompt: '',
      responses: [],

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
      
      clearResponses: () => set({ responses: [] })
    }),
    {
      name: 'model-store',
      partialize: (state) => ({
        models: state.models,
        useUnifiedPrompt: state.useUnifiedPrompt,
        unifiedSystemPrompt: state.unifiedSystemPrompt,
      }),
    }
  )
) 