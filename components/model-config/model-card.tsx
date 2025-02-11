'use client'

import { API_PROVIDERS, ModelConfig, MODEL_PRESETS, SystemPrompt } from '@/lib/types'
import { useModelStore } from '@/lib/store/model-store'
import { useEffect } from 'react'

export function ModelCard({ model }: { model: ModelConfig }) {
  const { updateModel, removeModel, systemPrompts, authCode, setAuthCode, autoFillApiKey } = useModelStore()

  useEffect(() => {
    updateModel(model.id, { apiKey: '' })
  }, [])

  const handleProviderChange = (providerId: string) => {
    const provider = API_PROVIDERS.find(p => p.id === providerId)
    if (provider) {
      const defaultModel = MODEL_PRESETS.find(m => m.provider === providerId)
      updateModel(model.id, {
        provider: providerId as typeof model.provider,
        proxyUrl: provider.id === 'custom' ? model.proxyUrl : provider.url,
        modelType: defaultModel?.id || ''
      })
    }
  }

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">模型配置</h3>
        <button
          onClick={() => removeModel(model.id)}
          className="text-white/80 hover:text-white transition-colors"
        >
          删除
        </button>
      </div>

      <div className="space-y-4">
        {/* API 提供商选择 */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            API 提供商
          </label>
          <select
            value={model.provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white appearance-none hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {API_PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* API URL */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            API URL
          </label>
          <input
            type="text"
            value={model.proxyUrl || ''}
            onChange={(e) => updateModel(model.id, { proxyUrl: e.target.value })}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="输入 API URL"
          />
        </div>

        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            模型类型
          </label>
          <div className="flex gap-2">
            <select
              value={model.modelType}
              onChange={(e) => updateModel(model.id, { modelType: e.target.value })}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white appearance-none hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">选择模型</option>
              {MODEL_PRESETS.filter(preset => preset.provider === model.provider).map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} - {preset.description}
                </option>
              ))}
              <option value="custom">自定义模型</option>
            </select>
          </div>
          
          {/* 自定义模型输入框 */}
          {model.modelType === 'custom' && (
            <input
              type="text"
              value={model.customModelType || ''}
              onChange={(e) => updateModel(model.id, { customModelType: e.target.value })}
              className="mt-2 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white"
              placeholder="输入自定义模型名称"
            />
          )}
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white mb-2">API Key</label>
          <input
            type="password"
            value={model.apiKey || ''}
            onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="输入 API Key"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            System Prompt
          </label>
          <select
            value={model.systemPromptId || ''}
            onChange={(e) => {
              const promptId = e.target.value
              if (promptId) {
                const selectedPrompt = systemPrompts.find(p => p.id === promptId)
                updateModel(model.id, { 
                  systemPromptId: promptId,
                  systemPrompt: selectedPrompt?.content
                })
              } else {
                updateModel(model.id, { 
                  systemPromptId: undefined,
                  systemPrompt: ''
                })
              }
            }}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white appearance-none hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="">选择预设 Prompt</option>
            {systemPrompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.name}
              </option>
            ))}
          </select>
          
          {!model.systemPromptId && (
            <textarea
              placeholder="自定义 System Prompt..."
              value={model.systemPrompt || ''}
              onChange={(e) => updateModel(model.id, { systemPrompt: e.target.value })}
              className="mt-2 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white h-32"
            />
          )}
        </div>
      </div>
    </div>
  )
} 