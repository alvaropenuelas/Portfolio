import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import { Globe, FileText, Mail } from 'lucide-react'
import { SplineScene } from './ui/splite'
import { Spotlight } from './ui/spotlight'
import { GithubIcon } from './ui/GithubIcon'
import { LinkedInIcon } from './ui/LinkedInIcon'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

/* ── Marine snow — native Canvas 2D (no R3F / react-reconciler) */
function useMarineSnow(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    type Particle = { x: number; y: number; speed: number; r: number }
    const COUNT = 300
    const particles: Particle[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width  = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }
    resize()

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.35,
        r:     0.5 + Math.random() * 1.2,
      })
    }

    let rafId: number
    let animating = true

    const draw = () => {
      if (!animating) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(93,202,165,0.35)'
      for (const p of particles) {
        p.y -= p.speed
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }
    draw()

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animating) { animating = true; draw() }
      else if (!entry.isIntersecting)          { animating = false; cancelAnimationFrame(rafId) }
    }, { threshold: 0 })
    obs.observe(canvas)

    const onResize = () => { resize() }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      animating = false
      cancelAnimationFrame(rafId)
      obs.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
}

/* ── Bento card wrapper ──────────────────────────────────── */
function BentoCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-2xl border border-white/[0.08]',
        'bg-white/[0.04] p-5 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SKILLS = [
  'Python', 'R', 'PyTorch', 'YOLOv8', 'EfficientNet',
  'RandomForest', 'Bio-ORACLE', 'Mann-Kendall', 'folium', 'GBIF', 'GIS',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

/* ── Main component ──────────────────────────────────────── */
export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null)
  const snowRef    = useRef<HTMLCanvasElement>(null)
  const bar1Ref    = useRef<HTMLDivElement>(null)
  const bar2Ref    = useRef<HTMLDivElement>(null)
  const bar3Ref    = useRef<HTMLDivElement>(null)

  useMarineSnow(snowRef)

  /* Caustic bars — infinite GSAP sine loops */
  useGSAP(
    () => {
      const bars      = [bar1Ref.current, bar2Ref.current, bar3Ref.current]
      const durations = [10, 13, 16]
      const delays    = [0, 3, 6]
      bars.forEach((bar, i) => {
        if (!bar) return
        gsap.to(bar, {
          y: '-30%',
          duration: durations[i],
          delay: delays[i],
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen bg-[#060d12] overflow-hidden flex items-center px-4 md:px-6 py-24"
    >
      {/* LAYER 1 — Marine snow (native Canvas 2D) */}
      <canvas
        ref={snowRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      />

      {/* LAYER 2 — Caustic light bars */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <div ref={bar1Ref} className="absolute left-[18%] top-[-60%] w-px h-[220%] opacity-[0.06]"
          style={{ background: 'linear-gradient(to bottom,transparent,#1D9E75,transparent)' }} />
        <div ref={bar2Ref} className="absolute left-[48%] top-[-40%] w-px h-[220%] opacity-[0.05]"
          style={{ background: 'linear-gradient(to bottom,transparent,#5DCAA5,transparent)' }} />
        <div ref={bar3Ref} className="absolute left-[73%] top-[-80%] w-px h-[220%] opacity-[0.04]"
          style={{ background: 'linear-gradient(to bottom,transparent,#0F6E56,transparent)' }} />
      </div>

      {/* Aceternity spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* LAYER 3 — Spline cubes (interactive, right half) */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-[2] opacity-40">
        <SplineScene
          scene="https://prod.spline.design/wFeXSQgtuL6sREkd/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* LAYER 4 — Bento grid */}
      <div className="pointer-events-none relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-12 gap-3 auto-rows-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Card 1 — Name + bio */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-5">
            <BentoCard className="h-full flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">AP</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#E8F0ED] leading-tight">
                    Álvaro Peñuelas Sánchez
                  </h1>
                  <p className="text-[#5DCAA5] font-medium text-sm mt-0.5">Marine Ecologist · Data Scientist</p>
                </div>
              </div>
              <p className="text-[#E8F0ED]/40 text-sm leading-relaxed">
                Building computational tools at the intersection of biodiversity science and deep learning.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a href="#projects"
                  className="pointer-events-auto px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors">
                  View Projects →
                </a>
                <a href="#contact"
                  className="pointer-events-auto px-4 py-2 rounded-lg border border-white/15 hover:border-white/30 text-[#E8F0ED]/70 hover:text-[#E8F0ED] text-xs font-medium transition-colors">
                  Get in Touch
                </a>
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 2 — Status */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-4">
            <BentoCard className="h-full bg-teal-900/40 flex flex-col justify-center min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <p className="text-teal-300 text-[11px] font-mono uppercase tracking-[0.18em]">Open to Opportunities</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['PhD 2026', 'Industry', 'Freelance'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-mono text-teal-200 border border-teal-500/30 bg-teal-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 3 — Skills */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-3">
            <BentoCard className="h-full">
              <p className="text-[11px] text-[#1D9E75] font-mono uppercase tracking-[0.18em] mb-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] text-teal-200 bg-teal-900/35 border border-teal-700/25">{s}</span>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 4 — Education */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-4">
            <BentoCard className="h-full bg-teal-950/60">
              <p className="text-[11px] text-[#1D9E75] font-mono uppercase tracking-[0.18em] mb-3">Education</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[#E8F0ED] text-sm font-semibold leading-snug">MSc Marine &amp; Lacustrine Science</p>
                  <p className="text-[#E8F0ED]/45 text-xs mt-0.5">VUB / UGhent / UAntwerp — Cum Laude</p>
                </div>
                <div>
                  <p className="text-[#E8F0ED] text-sm font-semibold leading-snug">BSc Biology</p>
                  <p className="text-[#E8F0ED]/45 text-xs mt-0.5">UNavarra — EIA mention</p>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 5 — Field work */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-4">
            <BentoCard className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-teal-400" aria-hidden="true" />
                <p className="text-[11px] text-[#1D9E75] font-mono uppercase tracking-[0.18em]">Field Work</p>
              </div>
              <p className="text-[#E8F0ED]/70 text-sm leading-relaxed">Vietnam · Tenerife · Cabo Verde · Belgium</p>
              <p className="text-[#E8F0ED]/30 text-xs mt-2 font-mono">Marine surveys · transect analysis · photographic ID</p>
            </BentoCard>
          </motion.div>

          {/* Card 6 — Languages */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-2">
            <BentoCard className="h-full">
              <p className="text-[11px] text-[#1D9E75] font-mono uppercase tracking-[0.18em] mb-3">Languages</p>
              <div className="space-y-1.5">
                {[['ES','Native'],['EN','Advanced'],['FR','Medium'],['DE','Medium']].map(([lang, level]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#E8F0ED]/60">{lang}</span>
                    <span className="text-[11px] text-[#E8F0ED]/35">{level}</span>
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 7 — Publication */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-6">
            <BentoCard className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} className="text-teal-400" aria-hidden="true" />
                <span className="text-[11px] font-mono text-amber-400 border border-amber-500/30 bg-amber-900/20 px-2 py-0.5 rounded">
                  IN PREPARATION
                </span>
              </div>
              <p className="text-[#E8F0ED] text-sm font-semibold leading-snug">
                Cypridopsis vidua population response to eutrophication gradients
              </p>
              <p className="text-[#E8F0ED]/40 text-xs mt-1.5 font-mono">Hydrobiologia — ostracod ecology · Belgium</p>
            </BentoCard>
          </motion.div>

          {/* Card 8 — Links */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-6">
            <BentoCard className="h-full">
              <p className="text-[11px] text-[#1D9E75] font-mono uppercase tracking-[0.18em] mb-3">Connect</p>
              <div className="space-y-2.5">
                <a href="https://github.com/alvaropenuelas" target="_blank" rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-3 group">
                  <GithubIcon size={14} className="text-[#E8F0ED]/40 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                  <span className="text-xs text-[#E8F0ED]/60 group-hover:text-[#E8F0ED] transition-colors font-mono">alvaropenuelas</span>
                </a>
                <a href="https://www.linkedin.com/in/%C3%A1lvaro-pe%C3%B1uelas-9116712b8" target="_blank" rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-3 group">
                  <LinkedInIcon size={14} className="text-[#E8F0ED]/40 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                  <span className="text-xs text-[#E8F0ED]/60 group-hover:text-[#E8F0ED] transition-colors font-mono">Álvaro Peñuelas</span>
                </a>
                <a href="mailto:apenuelas1499@gmail.com"
                  className="pointer-events-auto flex items-center gap-3 group">
                  <Mail size={14} className="text-[#E8F0ED]/40 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                  <span className="text-xs text-[#E8F0ED]/60 group-hover:text-[#E8F0ED] transition-colors font-mono">apenuelas1499@gmail.com</span>
                </a>
              </div>
            </BentoCard>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
