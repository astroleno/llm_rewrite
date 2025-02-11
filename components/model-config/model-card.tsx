'use client'

import { API_PROVIDERS, ModelConfig, MODEL_PRESETS, SystemPrompt } from '@/lib/types'
import { useModelStore } from '@/lib/store/model-store'

export function ModelCard({ model }: { model: ModelConfig }) {
  const { updateModel, removeModel, systemPrompts, authCode, setAuthCode, autoFillApiKey } = useModelStore()

  const handleProviderChange = (providerId: string) => {
    const provider = API_PROVIDERS.find(p => p.id === providerId)
    if (provider) {
      updateModel(model.id, {
        provider: providerId as typeof model.provider,
        proxyUrl: provider.id === 'custom' ? model.proxyUrl : provider.url
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
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            {API_PROVIDERS.map((provider) => (
              <option 
                key={provider.id} 
                value={provider.id}
                className="bg-black/70 backdrop-blur-md text-white hover:bg-black/80"
              >
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* 自定义 URL */}
        {model.provider === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              自定义 API URL
            </label>
            <input
              type="text"
              value={model.proxyUrl || ''}
              onChange={(e) => updateModel(model.id, { proxyUrl: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/50 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        )}

        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            模型类型
          </label>
          <select
            value={model.modelType}
            onChange={(e) => updateModel(model.id, { modelType: e.target.value })}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white appearance-none hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            <option value="">选择模型</option>
            {MODEL_PRESETS.filter(preset => preset.provider === model.provider).map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="text-white/80">API Key</label>
          <input
            type="password"
            value={model.apiKey || ''}
            onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
            className="flex-1 bg-white/10 rounded px-3 py-2 text-white"
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