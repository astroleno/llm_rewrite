import OpenAI from 'openai'
import { ModelConfig, ChatMessage, ModelResponse } from '../types'
import { ApiError } from '../utils/error-handler'
import { logger } from '../utils/logger'

export async function callModelApi(
  model: ModelConfig,
  systemPrompt: string,
  userPrompt: string,
  onProgress?: (content: string, reasoning?: string) => void
): Promise<ModelResponse> {
  if (!model.apiKey) {
    throw new ApiError('API Key 不能为空')
  }

  if (!model.modelType) {
    throw new ApiError('请选择模型类型')
  }

  // 记录请求信息
  logger.info({
    type: 'request',
    provider: model.provider,
    modelType: model.modelType,
    apiUrl: model.proxyUrl,
    hasApiKey: !!model.apiKey,
    timestamp: new Date().toISOString()
  })

  // 构建消息数组
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  // 构建完整的 URL
  const baseUrl = model.proxyUrl || (
    model.provider === 'siliconflow' 
      ? 'https://api.siliconflow.cn/v1/chat/completions'
      : model.provider === 'cybermuggles'
      ? 'http://124.222.75.42:4120/v1/chat/completions'
      : ''
  )

  try {
    // 直接使用 fetch 进行请求
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`
      },
      body: JSON.stringify({
        model: model.modelType === 'custom' ? model.customModelType || '' : model.modelType,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Stream not supported')
    }

    let content = ''
    let reasoning = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // 处理流式数据
      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.choices[0]?.delta?.content) {
              content += parsed.choices[0].delta.content
              if (onProgress) {
                onProgress(content, reasoning)
              }
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', e)
          }
        }
      }
    }

    return {
      modelId: model.id,
      response: content,
      reasoning: reasoning,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    }

  } catch (error) {
    let errorMessage = '未知错误'
    
    if (error instanceof Error) {
      console.log('API Error details:', error)
      errorMessage = error.message
      if (error.message.includes('API key')) {
        errorMessage = 'API Key 无效'
      } else if (error.message.includes('Rate limit')) {
        errorMessage = '请求频率超限'
      } else if (error.message.includes('insufficient_quota')) {
        errorMessage = 'API 配额不足'
      } else if (error.message.includes('404')) {
        errorMessage = 'API 地址无效，请检查 URL 配置'
      } else if (error.message.includes('Connection') || error.message.includes('Failed to fetch')) {
        errorMessage = '连接失败，请检查网络或 API 地址'
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请稍后重试'
      }
    }

    logger.error({
      type: 'error',
      provider: model.provider,
      modelType: model.modelType,
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })

    throw new ApiError(errorMessage)
  }
} 