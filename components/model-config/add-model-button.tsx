'use client'

import { useModelStore } from '@/lib/store/model-store'
import { PlusCircle } from 'lucide-react'

export function AddModelButton() {
  const { addModel } = useModelStore()
  
  return (
    <button
      onClick={addModel}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      <PlusCircle size={20} />
      添加模型
    </button>
  )
} 