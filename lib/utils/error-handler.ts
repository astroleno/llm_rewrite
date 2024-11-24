export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.details) {
      return `错误 (${error.statusCode}): ${error.message}\n详细信息: ${
        typeof error.details === 'string' ? error.details : JSON.stringify(error.details)
      }`
    }
    return `错误 (${error.statusCode}): ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return '发生未知错误'
} 