'use client'

import { useModelStore } from '@/lib/store/model-store'
import { callModelApi } from '@/lib/api/model-api'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function SendButton() {
  const {
    models,
    useUnifiedPrompt,
    unifiedSystemPrompt,
    userPrompt,
    setResponse,
    clearResponses
  } = useModelStore()

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleSend() {
    if (models.length === 0) {
      alert('请先添加至少一个模型配置')
      return
    }

    if (!userPrompt) {
      alert('请输入User Prompt')
      return
    }

    setIsLoading(true)
    setProgress(0)
    clearResponses()

    try {
      const total = models.length
      let completed = 0

      await Promise.all(
        models.map(async (model) => {
          try {
            const systemPrompt = useUnifiedPrompt 
              ? unifiedSystemPrompt 
              : model.systemPrompt || ''

            const response = await callModelApi(
              model,
              systemPrompt,
              userPrompt
            )

            setResponse({
              modelId: model.id,
              response
            })
          } catch (error) {
            setResponse({
              modelId: model.id,
              response: '',
              error: error instanceof Error ? error.message : '未知错误'
            })
          } finally {
            completed++
            setProgress((completed / total) * 100)
          }
        })
      )
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={isLoading}
      className={`
        relative px-6 py-2 rounded-md text-white
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-500 hover:bg-green-600'}
        transition-colors
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span>处理中 ({Math.round(progress)}%)</span>
        </div>
      ) : (
        '发送请求'
      )}
    </button>
  )
} 