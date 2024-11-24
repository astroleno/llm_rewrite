'use client'

import { AnimatedBackground } from '@/components/ui/animated-background'
import { PromptPanel } from '@/components/prompt/prompt-panel'
import { ModelConfigPanel } from '@/components/model-config/model-config-panel'
import { ResponsePanel } from '@/components/response/response-panel'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen p-6 relative">
        <div className="max-w-7xl mx-auto space-y-8 page-transition">
          <header className="text-center py-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              AI Models Comparison
            </h1>
            <p className="text-white/80">
              比较不同 AI 模型的响应结果
            </p>
          </header>

          {/* Prompt 设置区域 */}
          <section className="glass-panel p-6 breathing-shadow">
            <PromptPanel />
          </section>

          {/* 模型配置区域 */}
          <section className="glass-panel p-6 breathing-shadow">
            <ModelConfigPanel />
          </section>

          {/* 响应结果区域 */}
          <section className="glass-panel p-6 breathing-shadow">
            <ResponsePanel />
          </section>
        </div>
      </main>
    </>
  )
}
