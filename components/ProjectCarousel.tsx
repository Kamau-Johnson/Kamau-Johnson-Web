"use client"

import { useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { Github, ExternalLink, ArrowRight } from "lucide-react"

type Project = {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  category: string
}

type CarouselProps = {
  accentColor: "blue" | "purple"
  projects: Project[]
  onProjectClick: (id: string) => void
}

const accents = {
  blue: {
    label:  "text-blue-400",
    badge:  "bg-blue-600/10 text-blue-400 border border-blue-500/30",
    tag:    "bg-blue-950/60 text-blue-300 border border-blue-800/40",
    dot:    "bg-blue-500",
    border: "hover:border-blue-600/50",
    btn:    "bg-blue-600 hover:bg-blue-500 text-white",
  },
  purple: {
    label:  "text-purple-400",
    badge:  "bg-purple-600/10 text-purple-400 border border-purple-500/30",
    tag:    "bg-purple-950/60 text-purple-300 border border-purple-800/40",
    dot:    "bg-purple-500",
    border: "hover:border-purple-600/50",
    btn:    "bg-purple-600 hover:bg-purple-500 text-white",
  },
} as const

export default function ProjectCarousel({
  accentColor,
  projects,
  onProjectClick,
}: CarouselProps) {
  const a = accents[accentColor]

  const trackRef    = useRef<HTMLDivElement>(null)
  const rafRef      = useRef<number | null>(null)
  const targetRef   = useRef(0)
  const currentRef  = useRef(0)
  const hoveringRef = useRef(false)
  const mouseXRef   = useRef(0)

  const animate = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    if (hoveringRef.current) {
      const rect      = track.getBoundingClientRect()
      const relX      = (mouseXRef.current - rect.left) / rect.width
      const maxScroll = track.scrollWidth - track.clientWidth
      targetRef.current = relX * maxScroll
    }

    currentRef.current += (targetRef.current - currentRef.current) * 0.06
    track.scrollLeft    = currentRef.current
    rafRef.current      = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animate])

  const onMouseMove  = useCallback((e: React.MouseEvent) => { mouseXRef.current = e.clientX }, [])
  const onMouseEnter = useCallback(() => { hoveringRef.current = true }, [])
  const onMouseLeave = useCallback(() => {
    hoveringRef.current = false
    if (trackRef.current) targetRef.current = trackRef.current.scrollLeft
  }, [])

  const cards = [...projects, ...projects]

  return (
    <div className="mt-14 mb-4">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-black to-transparent" />

        <div
          ref={trackRef}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="flex gap-5 overflow-x-hidden cursor-none select-none pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((project, i) => (
            <div
              key={`${project.id}-${i}`}
              className={`group relative flex-shrink-0 w-52 sm:w-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${a.border}`}
            >
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-70" />
                <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm ${a.badge}`}>
                  {project.category === "dev" ? "Dev" : "Data"}
                </span>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-white leading-snug mb-1.5 line-clamp-2">
                  {project.title}
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.slice(0, 3).map((t, ti) => (
                    <span key={ti} className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${a.tag}`}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onProjectClick(project.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${a.btn}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Details
                  </button>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all duration-200 active:scale-95"
                  >
                    <Github className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${a.dot}`} />
            </div>
          ))}
        </div>
      </div>

      <p className="sm:hidden text-center text-gray-600 text-xs mt-2 tracking-wide">
        ← swipe to explore →
      </p>
    </div>
  )
}