'use client'

import { useState } from 'react'
import { useModelStore } from '@/lib/store/model-store'
import { SystemPromptManager } from './system-prompt-manager'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function PromptPanel() {
  const {
    useUnifiedPrompt,
    unifiedSystemPrompt,
    userPrompt,
    setUseUnifiedPrompt,
    setUnifiedSystemPrompt,
    setUserPrompt
  } = useModelStore()

  const [isSystemPromptCollapsed, setIsSystemPromptCollapsed] = useState(false)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Prompt 设置</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unified-prompt"
              checked={useUnifiedPrompt}
              onChange={(e) => setUseUnifiedPrompt(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="unified-prompt" className="text-white">
              使用统一的 System Prompt
            </label>
          </div>
          {useUnifiedPrompt && (
            <button
              onClick={() => setIsSystemPromptCollapsed(!isSystemPromptCollapsed)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isSystemPromptCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {useUnifiedPrompt && (
          <div className={`transition-all duration-300 ease-in-out ${
            isSystemPromptCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
          }`}>
            <label className="block text-sm font-medium text-white mb-1">
              System Prompt
            </label>
            <textarea
              value={unifiedSystemPrompt}
              onChange={(e) => setUnifiedSystemPrompt(e.target.value)}
              className="w-full h-32 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white resize-none"
              placeholder="输入统一的 System Prompt..."
            />
          </div>
        )}

        <SystemPromptManager />

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            User Prompt
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full h-32 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white resize-none"
            placeholder="输入要发送给模型的内容..."
          />
        </div>
      </div>
    </div>
  )
} 