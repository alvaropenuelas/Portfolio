import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Waves, Fish, Anchor, Camera, Video, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const iconMap = { Waves, Fish, Anchor, Camera, Video }
type IconKey = keyof typeof iconMap

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])
  const iconRefs   = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(
    (_ctx, contextSafe) => {
      /* ── Scroll entrance ──────────────────────────────── */
      gsap.from(cardRefs.current.filter(Boolean) as HTMLDivElement[], {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      })

      /* ── Hover animations (contextSafe so they no-op after unmount) */
      const cleanups: (() => void)[] = []

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const iconEl = iconRefs.current[i]

        const onEnter = contextSafe!(() => {
          gsap.to(card,   { scale: 1.03, duration: 0.3, ease: 'power2.out' })
          if (iconEl) gsap.to(iconEl, { y: -3, duration: 0.25 })
        })

        const onLeave = contextSafe!(() => {
          gsap.to(card,   { scale: 1,    duration: 0.3 })
          if (iconEl) gsap.to(iconEl, { y: 0,  duration: 0.25 })
        })

        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          card.removeEventListener('mouseenter', onEnter)
          card.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => cleanups.forEach(fn => fn())
    },
    { scope: sectionRef }
  )

  return (
    <section id="projects" ref={sectionRef} className="bg-white py-32">
      <div className="px-8 max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────── */}
        <p className="font-mono text-sm text-teal-600">02 / SELECTED WORK</p>
        <h2 className="text-5xl font-bold text-gray-900 mt-2 mb-16">Projects</h2>

        {/* ── Bento grid ────────────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-4 auto-rows-[200px] gap-4"
        >
          {projects.map((item, i) => {
            const Icon = iconMap[item.icon as IconKey]
            return (
              <div
                key={item.id}
                ref={el => { cardRefs.current[i] = el }}
                className={`${item.span} relative overflow-hidden rounded-2xl group cursor-pointer`}
              >
                {/* Background image */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60 transition-all group-hover:bg-black/50" />

                {/* Content */}
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">

                  {/* Top row — icon + tag chips */}
                  <div className="flex justify-between items-start">
                    <span
                      ref={el => { iconRefs.current[i] = el }}
                      aria-hidden="true"
                    >
                      {Icon && <Icon size={24} color="white" />}
                    </span>

                    <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                      {item.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom block — title + desc + GitHub link */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2 mb-3">
                      {item.desc}
                    </p>
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${item.title} on GitHub`}
                      className="inline-flex items-center gap-1.5 border border-teal-400/50 text-teal-300 text-xs rounded-full px-3 py-1 hover:bg-teal-900/40 hover:border-teal-300 transition-all"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      GitHub
                    </a>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
