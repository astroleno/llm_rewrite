'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-gradient"
        style={{
          backgroundImage: `linear-gradient(
            -45deg,
            var(--instagram-purple),
            var(--instagram-red),
            var(--instagram-yellow),
            var(--instagram-purple)
          )`,
          backgroundSize: '400% 400%'
        }}
      />
      <div className="absolute inset-0 bg-black/5" />
    </div>
  )
}

// 在 globals.css 中添加以下样式 