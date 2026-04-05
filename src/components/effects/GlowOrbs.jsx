export default function GlowOrbs({ variant = 'hero', className = '' }) {
  const configs = {
    hero: [
      { size: 500, opacity: 0.12, top: '-15%', left: '-10%', delay: '0s', dur: '8s' },
      { size: 350, opacity: 0.08, bottom: '10%', right: '-5%', delay: '2s', dur: '10s' },
      { size: 250, opacity: 0.06, top: '40%', right: '15%', delay: '4s', dur: '12s' },
    ],
    section: [
      { size: 350, opacity: 0.08, top: '10%', left: '-5%', delay: '0s', dur: '10s' },
      { size: 250, opacity: 0.05, bottom: '15%', right: '-8%', delay: '3s', dur: '12s' },
    ],
    subtle: [
      { size: 250, opacity: 0.04, top: '20%', left: '10%', delay: '0s', dur: '12s' },
    ],
  }

  const orbs = configs[variant] || configs.subtle

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true" style={{ contain: 'strict' }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-glow-float"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, rgba(200, 255, 0, ${orb.opacity}) 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            animationDelay: orb.delay,
            animationDuration: orb.dur,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
