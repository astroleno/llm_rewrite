'use client'

import { useModelStore } from '@/lib/store/model-store'
import { useState } from 'react'
import { callModelApi } from '@/lib/api/model-api'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function ResponsePanel() {
  const { models, userPrompt, useUnifiedPrompt, unifiedSystemPrompt, responses, setResponse } = useModelStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSubmit = async () => {
    if (!userPrompt) {
      alert('请输入 User Prompt')
      return
    }

    setIsLoading(true)

    try {
      await Promise.all(
        models.map(async (model) => {
          try {
            const systemPrompt = useUnifiedPrompt 
              ? unifiedSystemPrompt 
              : model.systemPrompt || ''

            const response = await callModelApi(model, systemPrompt, userPrompt)
            setResponse({ modelId: model.id, response })
          } catch (error) {
            setResponse({
              modelId: model.id,
              response: '',
              error: error instanceof Error ? error.message : '未知错误'
            })
          }
        })
      )
    } finally {
      setIsLoading(false)
      setIsCollapsed(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">响应结果</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !userPrompt || models.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '请求中...' : '发送请求'}
          </button>
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
        {models.map((model) => {
          const response = responses.find(r => r.modelId === model.id)
          return (
            <div key={model.id} className="glass-panel p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {model.modelType || '未命名模型'}
              </h3>
              <div className="h-64 overflow-auto bg-white/10 rounded-md p-4">
                {response?.error ? (
                  <p className="text-red-400">{response.error}</p>
                ) : response?.response ? (
                  <p className="text-white whitespace-pre-wrap">{response.response}</p>
                ) : (
                  <p className="text-white/50 italic">暂无响应</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 