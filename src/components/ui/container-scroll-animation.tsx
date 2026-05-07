import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

interface ContainerScrollProps {
  titleComponent?: React.ReactNode
  children: React.ReactNode
}

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Flatten from 18° tilt to 0° over first 55% of scroll range
  const rotateX = useTransform(scrollYProgress, [0, 0.55], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.04, 1])

  // Title fades + rises over the first 25% of scroll
  const titleY = useTransform(scrollYProgress, [0, 0.25], [0, -56])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])

  if (shouldReduceMotion) {
    return (
      <div className="w-full flex flex-col items-center">
        {titleComponent && <div className="mb-8 text-center">{titleComponent}</div>}
        {children}
      </div>
    )
  }

  return (
    // Outer: tall enough to give scroll space — sticky content lives inside
    <div ref={containerRef} className="relative" style={{ height: '145vh' }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {titleComponent && (
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="text-center mb-6 z-10 pointer-events-none"
          >
            {titleComponent}
          </motion.div>
        )}

        {/* Perspective wrapper — CSS perspective lives on the parent */}
        <div style={{ perspective: '1100px', width: '100%' }}>
          <motion.div
            style={{
              rotateX,
              scale,
              transformOrigin: 'center top',
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
