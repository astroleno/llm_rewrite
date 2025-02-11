'use client'

import { useModelStore } from '@/lib/store/model-store'
import { ModelCard } from './model-card'
import { AddModelButton } from './add-model-button'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function ModelConfigPanel() {
  const { models, autoFillAllApiKeys } = useModelStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">模型配置</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={autoFillAllApiKeys}
            className="glass-panel flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-all hover:scale-105"
          >
            自动填充所有 API Key
          </button>
          <AddModelButton />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <>
                展开
                <ChevronDown className="w-5 h-5" />
              </>
            ) : (
              <>
                折叠
                <ChevronUp className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
      }`}>
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  )
} 