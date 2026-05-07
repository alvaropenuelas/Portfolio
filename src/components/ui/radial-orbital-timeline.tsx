import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TimelineEntry } from '@/data/timeline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* ── Colour maps ─────────────────────────────────────────── */
const CATEGORY_COLOR: Record<string, string> = {
  Education: '#0F6E56',
  Field:     '#2563eb',
  Research:  '#7c3aed',
}

const CATEGORY_PILL: Record<string, string> = {
  Education: 'text-teal-700 border-teal-200 bg-teal-50',
  Field:     'text-blue-700 border-blue-200 bg-blue-50',
  Research:  'text-purple-700 border-purple-200 bg-purple-50',
}

/* ── SVG constants ───────────────────────────────────────── */
const SVG_SIZE = 480
const CX = SVG_SIZE / 2
const CY = SVG_SIZE / 2
const ORBIT_R = 185

interface Props {
  items: TimelineEntry[]
}

export function RadialOrbitalTimeline({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<number | null>(null)

  useGSAP(
    () => {
      const trigger = { trigger: containerRef.current, start: 'top 72%' }
      gsap.from('.rot-center', { scale: 0, opacity: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: trigger })
      gsap.from('.rot-ring',   { scale: 0, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: trigger })
      gsap.from('.rot-line',   { opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.3, ease: 'power1.out', scrollTrigger: trigger })
      gsap.from('.rot-dot',    { scale: 0,   opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.5, ease: 'back.out(2)', scrollTrigger: trigger })
    },
    { scope: containerRef }
  )

  const activeItem  = items.find(i => i.id === activeId)
  const relatedItems = activeItem
    ? items.filter(i => activeItem.relatedIds.includes(i.id))
    : []

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 bg-white"
    >
      {/* ── SVG Orbital diagram ──────────────────────────── */}
      <div className="relative flex-shrink-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-full"
          aria-label="Experience timeline orbital diagram"
          role="img"
        >
          <defs>
            {/* Ambient glow — subtle on white */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#1D9E75" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1D9E75" stopOpacity="0"   />
            </radialGradient>

            {/* Center orb gradient: teal-600 → teal-400 → emerald-400 */}
            <linearGradient id="orbGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#0F6E56" />
              <stop offset="50%"  stopColor="#1D9E75" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <filter id="dotGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ambient glow */}
          <circle cx={CX} cy={CY} r="120" fill="url(#centerGlow)" className="rot-ring" />

          {/* Dashed orbit ring — border-teal-900/20 */}
          <circle
            cx={CX} cy={CY} r={ORBIT_R}
            fill="none"
            stroke="rgba(15,110,86,0.2)"
            strokeWidth="1"
            strokeDasharray="5 7"
            className="rot-ring"
          />

          {/* Center orb — gradient fill */}
          <circle
            cx={CX} cy={CY} r="54"
            fill="url(#orbGradient)"
            className="rot-center"
          />
          {/* White text on gradient orb */}
          <text x={CX} y={CY - 7} textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter,sans-serif" className="rot-center">AP</text>
          <text x={CX} y={CY + 11} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="8" fontFamily="monospace" letterSpacing="2" className="rot-center">ECO·ML</text>

          {/* Lines + dots */}
          {items.map((item, i) => {
            const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2
            const x     = CX + ORBIT_R * Math.cos(angle)
            const y     = CY + ORBIT_R * Math.sin(angle)
            const isActive  = activeId === item.id
            const isRelated = relatedItems.some(r => r.id === item.id)
            const color  = CATEGORY_COLOR[item.category] ?? '#0F6E56'
            const dotR   = isActive ? 10 : 4 + (item.energy / 100) * 4

            return (
              <g key={item.id}>
                {/* Connecting line */}
                <line
                  className="rot-line"
                  x1={CX} y1={CY} x2={x} y2={y}
                  stroke={isRelated ? 'rgba(15,110,86,0.3)' : 'rgba(0,0,0,0.07)'}
                  strokeWidth={isRelated ? 1.5 : 1}
                />

                {/* Hit area */}
                <circle
                  cx={x} cy={y} r="22"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  role="button"
                  aria-label={item.title}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActiveId(isActive ? null : item.id)}
                />

                {/* Visible dot */}
                <circle
                  cx={x} cy={y} r={dotR}
                  fill={isActive ? color : isRelated ? color : color}
                  fillOpacity={isActive ? 1 : isRelated ? 0.75 : 0.6}
                  stroke={isActive ? color : isRelated ? color : 'transparent'}
                  strokeOpacity={0.3}
                  strokeWidth="3"
                  className="rot-dot"
                  style={{ cursor: 'pointer', transition: 'r 0.25s ease' }}
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  filter={isActive || isRelated ? 'url(#dotGlow)' : undefined}
                />

                {/* Year label */}
                <text
                  x={x} y={y + 20}
                  textAnchor="middle"
                  fill="rgba(0,0,0,0.38)"
                  fontSize="9"
                  fontFamily="monospace"
                  className="rot-dot"
                  style={{ pointerEvents: 'none' }}
                >
                  {item.date}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* ── Detail panel ─────────────────────────────────── */}
      <div className="flex-1 w-full lg:w-auto min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white/95 border border-teal-900/20 rounded-2xl p-6 shadow-sm"
            >
              {/* Icon + date row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${CATEGORY_COLOR[activeItem.category]}12`,
                    borderColor:     `${CATEGORY_COLOR[activeItem.category]}30`,
                  }}
                >
                  <activeItem.icon
                    size={18}
                    style={{ color: CATEGORY_COLOR[activeItem.category] }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">{activeItem.date}</p>
                  <span className={cn('text-[11px] px-2 py-0.5 rounded-full border font-medium capitalize', CATEGORY_PILL[activeItem.category])}>
                    {activeItem.category}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {activeItem.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-5">
                {activeItem.content}
              </p>

              {/* Energy bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Impact</span>
                  <span className="text-[11px] font-mono text-gray-400">{activeItem.energy}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeItem.energy}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Status + related */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn(
                  'text-[11px] px-2.5 py-1 rounded-full border font-mono',
                  activeItem.status === 'completed'
                    ? 'text-teal-700 border-teal-200 bg-teal-50'
                    : 'text-amber-700 border-amber-200 bg-amber-50'
                )}>
                  {activeItem.status === 'completed' ? '✓ Completed' : '⟳ In progress'}
                </span>

                {relatedItems.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400 font-mono">linked:</span>
                    {relatedItems.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setActiveId(r.id)}
                        className="text-[11px] text-gray-400 hover:text-gray-700 underline decoration-dotted transition-colors font-mono"
                      >
                        {r.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-300 font-mono text-[11px] uppercase tracking-widest mb-5">
                Select a node →
              </p>
              <div className="space-y-2">
                {items.map(item => (
                  <button
                    key={item.id}
                    className="flex items-center gap-3 w-full text-left group min-h-[44px] cursor-pointer"
                    onClick={() => setActiveId(item.id)}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLOR[item.category] }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-mono text-gray-400 w-14 flex-shrink-0">{item.date}</span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-800 transition-colors">{item.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
