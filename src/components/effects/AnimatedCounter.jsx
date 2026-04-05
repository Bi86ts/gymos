import { useEffect, useRef, useState } from 'react'
import { useInView, motion, useMotionValue, useSpring, animate } from 'framer-motion'

export default function AnimatedCounter({
  to,
  from = 0,
  duration = 1.5,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(from)

  useEffect(() => {
    if (!isInView) return

    const controls = animate(from, to, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        setDisplay(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v))
      },
    })

    return () => controls.stop()
  }, [isInView, from, to, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
