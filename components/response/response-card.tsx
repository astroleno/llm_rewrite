'use client'

import { ModelConfig, ModelResponse } from '@/lib/types'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface ResponseCardProps {
  model: ModelConfig
  response?: ModelResponse
}

export function ResponseCard({ model, response }: ResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    if (response?.response) {
      await navigator.clipboard.writeText(response.response)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{model.modelType || '未命名模型'}</h3>
        <div className="flex items-center gap-2">
          {response?.response && (
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded"
              title="复制响应内容"
            >
              {isCopied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-gray-500" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="prose prose-sm max-w-none">
          {response ? (
            response.error ? (
              <div className="text-red-500 p-3 bg-red-50 rounded">
                {response.error}
              </div>
            ) : (
              <ReactMarkdown className="whitespace-pre-wrap">
                {response.response}
              </ReactMarkdown>
            )
          ) : (
            <div className="text-gray-400 italic">暂无响应</div>
          )}
        </div>
      )}
    </div>
  )
} 