'use client'

import { useModelStore } from '@/lib/store/model-store'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { callModelApi } from '@/lib/api/model-api'

export function ResponsePanel() {
  const { 
    models, 
    responses, 
    userPrompt, 
    useUnifiedPrompt, 
    unifiedSystemPrompt, 
    setResponse 
  } = useModelStore()
  
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
            console.log('Calling model:', model.modelType)
            const systemPrompt = useUnifiedPrompt 
              ? unifiedSystemPrompt 
              : model.systemPrompt || ''

            const response = await callModelApi(model, systemPrompt, userPrompt)
            console.log('Model response:', response)
            setResponse({ 
              modelId: model.id, 
              response: response.content,
              reasoning: response.reasoning,
              usage: response.usage
            })
          } catch (error) {
            console.error('Model error:', {
              modelType: model.modelType,
              provider: model.provider,
              error: error instanceof Error ? error.message : String(error)
            })
            
            let errorMessage = '未知错误'
            if (error instanceof Error) {
              if (error.message.includes('Function call is not supported')) {
                errorMessage = '此模型不支持函数调用功能'
              } else if (error.message.includes('负载已饱和')) {
                errorMessage = '服务器负载已满，请稍后重试'
              } else {
                errorMessage = error.message
              }
            }
            
            setResponse({
              modelId: model.id,
              response: '',
              error: errorMessage
            })
          }
        })
      )
    } catch (error) {
      console.error('Submit error:', error)
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
            className={`
              glass-panel flex items-center gap-2 px-4 py-2 text-white/80
              ${isLoading || !userPrompt || models.length === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:text-white hover:scale-105'}
              transition-all
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                请求中...
              </>
            ) : (
              '发送请求'
            )}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/80 hover:text-white transition-colors"
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
              <div className="space-y-4">
                {response?.error ? (
                  <p className="text-red-400">{response.error}</p>
                ) : (
                  <>
                    {/* 主要响应 */}
                    <div className="h-64 overflow-auto bg-white/10 rounded-md p-4">
                      <p className="text-white whitespace-pre-wrap">
                        {response?.response || '暂无响应'}
                      </p>
                    </div>
                    
                    {/* 推理过程 */}
                    {response?.reasoning && (
                      <div className="bg-white/5 rounded-md p-4">
                        <h4 className="text-sm font-medium text-white/80 mb-2">推理过程</h4>
                        <p className="text-white/70 text-sm whitespace-pre-wrap">
                          {response.reasoning}
                        </p>
                      </div>
                    )}
                    
                    {/* 使用统计 */}
                    {response?.usage && (
                      <div className="bg-white/5 rounded-md p-4">
                        <h4 className="text-sm font-medium text-white/80 mb-2">使用统计</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
                          <div>提示词 Tokens: {response.usage.prompt_tokens}</div>
                          <div>完成 Tokens: {response.usage.completion_tokens}</div>
                          <div>总计 Tokens: {response.usage.total_tokens}</div>
                          {response.usage.completion_tokens_details && (
                            <>
                              <div>系统 Tokens: {response.usage.completion_tokens_details.system_tokens}</div>
                              <div>用户 Tokens: {response.usage.completion_tokens_details.user_tokens}</div>
                              <div>助手 Tokens: {response.usage.completion_tokens_details.assistant_tokens}</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 