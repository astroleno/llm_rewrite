'use client'

import { useModelStore } from '@/lib/store/model-store'
import { PlusCircle } from 'lucide-react'

export function AddModelButton() {
  const { addModel } = useModelStore()
  
  return (
    <button
      onClick={addModel}
      className="glass-panel flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-all hover:scale-105"
    >
      <PlusCircle size={20} />
      添加模型
    </button>
  )
} 