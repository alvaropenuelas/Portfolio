import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Mail, FileText } from 'lucide-react'
import { SplineScene } from './ui/splite'
import { GithubIcon } from './ui/GithubIcon'
import { LinkedInIcon } from './ui/LinkedInIcon'

gsap.registerPlugin(useGSAP)

/* ── Clickable card data ─────────────────────────────────── */
type Card = {
  label: string
  value: string
  href: string
  external?: boolean
  icon: React.ReactNode
}

const CARDS: Card[] = [
  {
    label: 'EMAIL',
    value: 'apenuelas1499@gmail.com',
    href: 'mailto:apenuelas1499@gmail.com',
    icon: <Mail size={20} className="text-teal-400" aria-hidden="true" />,
  },
  {
    label: 'GITHUB',
    value: 'github.com/alvaropenuelas',
    href: 'https://github.com/alvaropenuelas',
    external: true,
    icon: <GithubIcon size={20} className="text-teal-400" />,
  },
  {
    label: 'LINKEDIN',
    value: 'álvaro-peñuelas',
    href: 'https://www.linkedin.com/in/%C3%A1lvaro-pe%C3%B1uelas-9116712b8',
    external: true,
    icon: <LinkedInIcon size={20} className="text-teal-400" />,
  },
]

const CARD_BASE = 'bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-teal-700/50 hover:bg-white/10 cursor-pointer'

/* ── Component ───────────────────────────────────────────── */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLAnchorElement | null)[]>([])

  useGSAP(
    (_ctx, contextSafe) => {
      const cleanups: (() => void)[] = []

      cardRefs.current.forEach(card => {
        if (!card) return

        const onEnter = contextSafe!(() =>
          gsap.to(card, { scale: 1.01, duration: 0.25, ease: 'power2.out' })
        )
        const onLeave = contextSafe!(() =>
          gsap.to(card, { scale: 1, duration: 0.25 })
        )

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
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#060d12] relative overflow-hidden min-h-screen"
    >
      {/* LAYER 1 — Spline background (decorative, non-interactive) */}
      <div className="pointer-events-none absolute inset-0 w-full h-full z-0 opacity-20" aria-hidden="true">
        <SplineScene
          scene="https://prod.spline.design/wFeXSQgtuL6sREkd/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* LAYER 2 — Content */}
      <div className="relative z-10 px-8 lg:px-16 py-32 max-w-7xl mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">

          {/* ── Left column ─────────────────────────────── */}
          <div>
            <p className="font-mono text-sm text-teal-500 mb-4">04 / CONTACT</p>
            <h2>
              <span className="text-6xl font-bold text-white block">Let's work</span>
              <span className="text-6xl font-bold text-teal-400 block">together.</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-md leading-relaxed text-base">
              Open to PhD positions, industry roles, and freelance projects in marine ecology
              and data science.
            </p>
          </div>

          {/* ── Right column — contact cards ─────────────── */}
          <div className="flex flex-col gap-3">

            {/* Clickable cards */}
            {CARDS.map((card, i) => (
              <a
                key={card.label}
                ref={el => { cardRefs.current[i] = el }}
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noopener noreferrer' : undefined}
                className={CARD_BASE}
                aria-label={`${card.label}: ${card.value}`}
              >
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-white font-medium truncate">{card.value}</p>
                </div>
              </a>
            ))}

            {/* CV card — disabled */}
            <div
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-white/10 hover:bg-white/5 cursor-not-allowed opacity-50"
              title="CV update in progress"
              aria-disabled="true"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-teal-400 opacity-40" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">CV</p>
                <p className="text-white font-medium">Coming soon</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────── */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <div className="pt-6 border-t border-white/5 text-center">
          <p className="font-mono text-xs text-gray-600">
            © 2026 Álvaro Peñuelas Sánchez · Built with React, Three.js, GSAP
          </p>
        </div>
      </div>

    </section>
  )
}
