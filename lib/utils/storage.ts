import { ModelConfig } from '../types'

const STORAGE_KEY = 'ai-model-comparison-tool'

interface StorageData {
  models: ModelConfig[]
  useUnifiedPrompt: boolean
  unifiedSystemPrompt: string
}

export function saveToStorage(data: StorageData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadFromStorage(): StorageData | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
} 