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
            var(--gradient-1),
            var(--gradient-2),
            var(--gradient-3),
            var(--gradient-4),
            var(--gradient-5)
          )`
        }}
      />
    </div>
  )
}

// 在 globals.css 中添加以下样式 