'use client'

import { API_PROVIDERS, ModelConfig, MODEL_PRESETS } from '@/lib/types'
import { useModelStore } from '@/lib/store/model-store'

export function ModelCard({ model }: { model: ModelConfig }) {
  const { updateModel, removeModel } = useModelStore()

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
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
          >
            {API_PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
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
              className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
              placeholder="输入自定义 API 地址"
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
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
          >
            <option value="">选择模型</option>
            {MODEL_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            API Key
          </label>
          <input
            type="password"
            value={model.apiKey}
            onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
          />
        </div>
      </div>
    </div>
  )
} 