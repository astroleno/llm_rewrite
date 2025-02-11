class Logger {
  private formatMessage(level: string, message: any): string {
    const timestamp = new Date().toISOString()
    const formattedMessage = typeof message === 'object' 
      ? JSON.stringify(message, null, 2) 
      : message
    return `[${timestamp}] [${level}] ${formattedMessage}`
  }

  log(level: string, message: any) {
    const formattedMessage = this.formatMessage(level, message)
    
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage)
        break
      case 'WARN':
        console.warn(formattedMessage)
        break
      case 'DEBUG':
        console.debug(formattedMessage)
        break
      default:
        console.log(formattedMessage)
    }

    // 如果需要，这里可以添加日志上报到服务器的逻辑
  }

  info(message: any) {
    this.log('INFO', message)
  }

  error(message: any) {
    this.log('ERROR', message)
  }

  debug(message: any) {
    this.log('DEBUG', message)
  }

  warn(message: any) {
    this.log('WARN', message)
  }
}

export const logger = new Logger() 