import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RadialOrbitalTimeline } from './ui/radial-orbital-timeline'
import { timelineData } from '@/data/timeline'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="experience" ref={sectionRef} className="bg-white py-32 px-8">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-sm text-teal-600">03 / EXPERIENCE</p>
        <h2 className="text-5xl font-bold text-gray-900 mt-2 mb-8">Timeline</h2>
      </div>

      {/* ── Orbital timeline ────────────────────────────── */}
      <div className="min-h-screen">
        <RadialOrbitalTimeline items={timelineData} />
      </div>

    </section>
  )
}
