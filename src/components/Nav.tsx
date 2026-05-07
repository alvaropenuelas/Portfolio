import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'hero',       label: 'Hero',       dark: true  },
  { id: 'projects',   label: 'Projects',   dark: false },
  { id: 'experience', label: 'Experience', dark: false },
  { id: 'contact',    label: 'Contact',    dark: true  },
]

export function Nav() {
  const [activeId, setActiveId] = useState('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { threshold: 0.5, rootMargin: '0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  const isDark = sections.find(s => s.id === activeId)?.dark ?? true

  const scrollToSection = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav
      aria-label="Page sections"
      className="fixed top-1/2 -translate-y-1/2 right-6 z-50 flex flex-col gap-4 items-center"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id
        return (
          <button
            key={id}
            onClick={scrollToSection(id)}
            aria-label={`Navigate to ${label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center gap-3 py-2"
            style={{ touchAction: 'manipulation' }}
          >
            {/* Label — fades in on group hover, floats left of dot */}
            <span
              className={cn(
                'absolute right-6 whitespace-nowrap text-xs font-mono',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                isDark ? 'text-white' : 'text-gray-700'
              )}
            >
              {label}
            </span>

            {/* Dot */}
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                isActive
                  ? 'scale-150 bg-teal-400'
                  : isDark
                    ? 'bg-white/40 hover:bg-white/70'
                    : 'bg-gray-400/60 hover:bg-gray-700'
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
