import { ModelConfig, XiApiRequestBody, XiApiResponse } from '@/lib/types'
import { ApiError, handleApiError } from '@/lib/utils/error-handler'

export async function callModelApi(
  model: ModelConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!model.apiKey) {
    throw new ApiError('API Key 不能为空')
  }

  if (!model.modelType) {
    throw new ApiError('请选择模型类型')
  }

  const requestBody: XiApiRequestBody = {
    model: model.modelType,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  }

  try {
    const apiUrl = model.proxyUrl || 'https://api.xi-ai.net/v1/chat/completions'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorJson = JSON.parse(errorText)
        throw new ApiError(
          errorJson.error?.message || 'API调用失败',
          response.status,
          errorJson
        )
      } catch (e) {
        throw new ApiError(
          'API调用失败',
          response.status,
          errorText
        )
      }
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      throw new ApiError(
        'API返回了非JSON格式的响应',
        response.status,
        text
      )
    }

    const data: XiApiResponse = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(handleApiError(error))
  }
} 