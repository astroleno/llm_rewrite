'use client'

import { useModelStore } from '@/lib/store/model-store'
import { ResponseCard } from './response-card'

export function ResponseList() {
  const { responses, models } = useModelStore()
  
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">响应结果</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <ResponseCard
            key={model.id}
            model={model}
            response={responses.find(r => r.modelId === model.id)}
          />
        ))}
      </div>
    </section>
  )
} 