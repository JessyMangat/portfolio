import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiExpress,
  SiGit,
  SiJavascript,
  SiHtml5,
  SiSass,
  SiLaravel,
  SiFirebase,
  SiWebrtc,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiGooglecloud,
} from 'react-icons/si'

const skills = [
  // left column
  { Icon: SiReact, color: '#61DAFB', top: '8%', left: '9%', size: 110, rotate: -8 },
  { Icon: SiGit, color: '#F05032', top: '24%', left: '5%', size: 80, rotate: -4 },
  { Icon: SiMongodb, color: '#47A248', top: '40%', left: '10%', size: 110, rotate: -6 },
  { Icon: SiLaravel, color: '#FF2D20', top: '56%', left: '6%', size: 90, rotate: 5 },
  { Icon: SiSwift, color: '#F05138', top: '72%', left: '11%', size: 95, rotate: -5 },
  { Icon: SiKotlin, color: '#7F52FF', top: '84%', left: '7%', size: 85, rotate: 4 },

  // right column
  { Icon: SiTypescript, color: '#3178C6', top: '10%', left: '90%', size: 95, rotate: 6 },
  { Icon: SiNodedotjs, color: '#5FA04E', top: '26%', left: '86%', size: 110, rotate: 5 },
  { Icon: SiTailwindcss, color: '#38BDF8', top: '42%', left: '92%', size: 90, rotate: 4 },
  { Icon: SiFirebase, color: '#FFCA28', top: '58%', left: '87%', size: 95, rotate: -3 },
  { Icon: SiPhp, color: '#777BB4', top: '74%', left: '91%', size: 85, rotate: 6 },
  { Icon: SiGooglecloud, color: '#4285F4', top: '92%', left: '92%', size: 85, rotate: -4 },

  // top band
  { Icon: SiDocker, color: '#2496ED', top: '5%', left: '35%', size: 75, rotate: 3 },
  { Icon: SiJavascript, color: '#F7DF1E', top: '4%', left: '50%', size: 80, rotate: 0 },
  { Icon: SiHtml5, color: '#E34F26', top: '6%', left: '65%', size: 80, rotate: -3 },

  // bottom band
  { Icon: SiNextdotjs, color: '#ffffff', top: '84%', left: '18%', size: 90, rotate: -3 },
  { Icon: SiWebrtc, color: '#ffffff', top: '80%', left: '50%', size: 75, rotate: 2 },
  { Icon: SiExpress, color: '#ffffff', top: '84%', left: '78%', size: 80, rotate: 7 },
  { Icon: SiMysql, color: '#4479A1', top: '92%', left: '32%', size: 85, rotate: -5 },
  { Icon: SiSass, color: '#CC6699', top: '92%', left: '66%', size: 85, rotate: 5 },
]

// Twice the previous reach. Icons and text are driven directly (opacity /
// background-position) from real distance-to-cursor every frame, computed
// per element from its own bounding box — not a CSS mask laid over a
// duplicate copy of the content. That means: no alignment to get subtly
// wrong, glyph descenders are automatically covered since the color is
// painted through the actual glyph, and the falloff is a smooth continuous
// blend instead of a hard mask edge.
const ICON_RADIUS = 220
const TEXT_RADIUS = 150

function litBackground(restColor: string) {
  return `radial-gradient(${TEXT_RADIUS}px circle at var(--mx, -9999px) var(--my, -9999px), #67e8f9 0%, #e879f9 30%, ${restColor} 68%)`
}

const nameLit: CSSProperties = {
  backgroundImage: litBackground('#ff8a3d'),
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}
const subtitleLit: CSSProperties = {
  backgroundImage: litBackground('rgba(244,241,234,0.4)'),
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}
const linkLit: CSSProperties = {
  backgroundImage: litBackground('rgba(244,241,234,0.6)'),
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

function App() {
  const haloRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const link1Ref = useRef<HTMLAnchorElement>(null)
  const link2Ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    let frame = 0

    const update = (clientX: number, clientY: number) => {
      if (haloRef.current) {
        haloRef.current.style.setProperty('--hx', `${clientX}px`)
        haloRef.current.style.setProperty('--hy', `${clientY}px`)
      }

      for (const el of iconRefs.current) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2))
        const t = Math.max(0, 1 - dist / ICON_RADIUS)
        const intensity = t * t
        el.style.opacity = String(intensity)
        el.style.filter = `drop-shadow(0 0 10px rgba(0,0,0,0.55)) drop-shadow(0 0 ${14 * intensity}px currentColor)`
      }

      for (const el of [nameRef.current, subtitleRef.current, link1Ref.current, link2Ref.current]) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${clientX - rect.left}px`)
        el.style.setProperty('--my', `${clientY - rect.top}px`)
      }
    }

    const onMove = (e: MouseEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        update(e.clientX, e.clientY)
        frame = 0
      })
    }

    update(window.innerWidth / 2, window.innerHeight * 0.32)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="relative min-h-svh cursor-default overflow-hidden bg-bg font-sans text-fg antialiased">
      {/* ambient halo that follows the cursor */}
      <div
        ref={haloRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(640px circle at var(--hx, -9999px) var(--hy, -9999px), rgba(255,255,255,0.16), transparent 60%)',
        }}
      />

      {/* skill logos: invisible except where the beam lands, intensity fades continuously with distance */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {skills.map(({ Icon, color, top, left, size, rotate }, i) => (
          <span
            key={i}
            ref={(el) => {
              iconRefs.current[i] = el
            }}
            className="absolute opacity-0"
            style={{ top, left, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
          >
            <Icon style={{ width: size, height: size, color }} />
          </span>
        ))}
      </div>

      {/* content — the only copies of this text; the light is painted directly onto them */}
      <div className="relative z-10 flex min-h-svh flex-col items-center px-6 pt-[16vh] text-center">
        <h1
          ref={nameRef}
          style={nameLit}
          className="rise-in font-display text-6xl leading-none font-bold sm:text-7xl"
        >
          Jessy Mangat
        </h1>

        <p
          ref={subtitleRef}
          style={subtitleLit}
          className="rise-in mt-3 font-mono text-xs tracking-widest uppercase [animation-delay:100ms]"
        >
          Senior Software Developer · Toronto, ON
        </p>

        <div className="rise-in mt-8 flex flex-col gap-3 font-mono text-sm sm:flex-row sm:gap-6 [animation-delay:180ms]">
          <a
            ref={link1Ref}
            href="https://github.com/JessyMangat"
            target="_blank"
            rel="noopener noreferrer"
            style={linkLit}
            className="cursor-pointer underline decoration-fg/20 underline-offset-4"
          >
            github.com/JessyMangat
          </a>
          <a
            ref={link2Ref}
            href="mailto:hello@jessymangat.com"
            style={linkLit}
            className="cursor-pointer underline decoration-fg/20 underline-offset-4"
          >
            hello@jessymangat.com
          </a>
        </div>
      </div>
    </main>
  )
}

export default App
