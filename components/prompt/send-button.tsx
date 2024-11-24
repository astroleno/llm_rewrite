'use client'

import { Loader2 } from 'lucide-react'

interface SendButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
  progress?: number
}

export function SendButton({ onClick, isLoading, disabled, progress }: SendButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        glass-panel flex items-center gap-2 px-6 py-2 text-white/80
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:scale-105'}
        transition-all
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>处理中 {progress ? `(${Math.round(progress)}%)` : ''}</span>
        </>
      ) : (
        '发送请求'
      )}
    </button>
  )
} 