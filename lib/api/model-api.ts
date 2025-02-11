import { ModelConfig, XiApiRequestBody, XiApiResponse } from '@/lib/types'
import { ApiError, handleApiError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'

export async function callModelApi(
  model: ModelConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<{ content: string; reasoning: string | undefined; usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number; completion_tokens_details?: { function_tokens?: number; system_tokens?: number; user_tokens?: number; assistant_tokens?: number } } }> {
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

  // 根据不同的提供商构建不同的请求体
  let requestBody: any
  
  if (model.provider === 'cybermuggles') {
    requestBody = {
      model: model.modelType,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      store: true,  // 存储对话历史
      return_reasoning: true  // 返回推理过程
    }
  } else if (model.provider === 'siliconflow') {
    requestBody = {
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false,
      max_tokens: 512,
      stop: ["null"],
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.5,
      n: 1,
      response_format: { type: "text" }
    }
  } else if (model.provider === 'yunwu') {
    requestBody = {
      model: model.modelType,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
      stream: false
    }
  } else {
    // CyberMuggles 的默认请求体
    requestBody = {
      model: model.modelType,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }
  }

  // 记录请求体
  console.log('Request Body:', JSON.stringify(requestBody, null, 2))

  try {
    const apiUrl = model.proxyUrl || 'https://api.xi-ai.net/v1/chat/completions'
    console.log('Calling API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    logger.info({
      type: 'response',
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      provider: model.provider,
      modelType: model.modelType
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error({
        type: 'error',
        status: response.status,
        statusText: response.statusText,
        errorText,
        provider: model.provider,
        modelType: model.modelType
      })
      try {
        const errorJson = JSON.parse(errorText)
        throw new ApiError(
          `API调用失败: ${errorJson.message || errorJson.error?.message}`,
          response.status,
          errorJson
        )
      } catch (e) {
        throw new ApiError(
          `API调用失败: ${errorText}`,
          response.status,
          errorText
        )
      }
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      console.error('Invalid Content Type:', contentType)
      console.error('Response Text:', text)
      throw new ApiError(
        'API返回了非JSON格式的响应',
        response.status,
        text
      )
    }

    const data: XiApiResponse = await response.json()
    logger.info({
      type: 'success',
      provider: model.provider,
      modelType: model.modelType,
      usage: data.usage,
      hasReasoning: !!data.choices[0].message.reasoning
    })
    return {
      content: data.choices[0].message.content,
      reasoning: data.choices[0].message.reasoning,
      usage: data.usage
    }
  } catch (error) {
    logger.error({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
      provider: model.provider,
      modelType: model.modelType
    })
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(handleApiError(error))
  }
} 