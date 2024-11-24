'use client'

import { useModelStore } from '@/lib/store/model-store'
import { ModelCard } from './model-card'
import { AddModelButton } from './add-model-button'

export function ModelList() {
  const { models } = useModelStore()
  
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">模型配置</h2>
        <AddModelButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </section>
  )
} 