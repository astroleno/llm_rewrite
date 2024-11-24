'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-gradient animate-gradient"
        style={{
          backgroundSize: '400% 400%',
          backgroundImage: `linear-gradient(
            -45deg,
            var(--instagram-purple),
            var(--instagram-red),
            var(--instagram-yellow),
            var(--instagram-purple)
          )`
        }}
      />
    </div>
  )
}

// 在 globals.css 中添加以下样式 