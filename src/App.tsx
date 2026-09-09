import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { layoutSkills } from './skillLayout'

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
  const [skills] = useState(() => layoutSkills(window.innerWidth, window.innerHeight))
  const haloRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const link1Ref = useRef<HTMLAnchorElement>(null)
  const link2Ref = useRef<HTMLAnchorElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = (clientX: number, clientY: number) => {
      if (haloRef.current) {
        haloRef.current.style.setProperty('--hx', `${clientX}px`)
        haloRef.current.style.setProperty('--hy', `${clientY}px`)
      }

      // only relevant at lg+ where the scattered icon layer is actually
      // visible — harmless no-op elsewhere since that layer is display:none
      for (const el of iconRefs.current) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2))
        const t = Math.max(0, 1 - dist / ICON_RADIUS)
        const opacity = t * t
        el.style.opacity = String(opacity)
        el.style.filter = `drop-shadow(0 0 10px rgba(0,0,0,0.55)) drop-shadow(0 0 ${14 * opacity}px currentColor)`
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

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch || frame) return
      frame = requestAnimationFrame(() => {
        update(touch.clientX, touch.clientY)
        frame = 0
      })
    }

    update(window.innerWidth / 2, window.innerHeight * 0.32)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Tray auto-scroll: creeps sideways on its own, pauses for 15s after the
  // user touches/scrolls it themselves, then quietly resumes. The tray
  // renders the icon set twice back to back so the wrap from the second
  // copy back to the first is seamless — no visible jump.
  useEffect(() => {
    const tray = trayRef.current
    if (!tray) return

    const PAUSE_MS = 15000
    const SPEED_PX_PER_FRAME = 0.35
    let lastInteraction = 0
    let frame = 0
    // element.scrollLeft rounds to whole pixels, so accumulating a
    // sub-pixel step by reading it back each frame would round-trip to
    // zero forever. Track true position ourselves instead.
    let position = tray.scrollLeft

    const onInteract = () => {
      lastInteraction = Date.now()
    }
    tray.addEventListener('touchstart', onInteract, { passive: true })
    tray.addEventListener('wheel', onInteract, { passive: true })

    const step = () => {
      frame = requestAnimationFrame(step)
      if (Date.now() - lastInteraction < PAUSE_MS) {
        position = tray.scrollLeft // stay in sync with any manual scrolling while paused
        return
      }
      const halfWidth = tray.scrollWidth / 2
      if (halfWidth <= 0) return
      position += SPEED_PX_PER_FRAME
      if (position >= halfWidth) {
        position -= halfWidth
      }
      tray.scrollLeft = position
    }
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      tray.removeEventListener('touchstart', onInteract)
      tray.removeEventListener('wheel', onInteract)
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

      {/* skill logos: invisible except where the beam lands, intensity fades continuously with
          distance. Only makes sense with a cursor to chase, so it's desktop-only (xl+, 1280px) —
          that keeps iPad Pro's 1024-wide portrait mode on the draggable tray below instead. */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden xl:block">
        {skills.map(({ Icon, color, top, left, size, rotate, url }, i) => (
          <span
            key={i}
            ref={(el) => {
              iconRefs.current[i] = el
            }}
            className="absolute opacity-0"
            style={{ top, left, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto block cursor-pointer"
              aria-label={url.replace(/^https?:\/\//, '')}
            >
              <Icon style={{ width: size, height: size, color }} />
            </a>
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

        {/* iPad (including 1024-wide Pro portrait) and smaller: a draggable tray instead of the
            cursor-chasing scatter layer. my-auto centers it in the leftover space below the
            links, halfway between the text and the bottom of the page. Bleeds edge-to-edge
            (cancels the parent's px-6) so icons can scroll flush with the screen; the scrollbar
            is hidden via .no-scrollbar and a mask fades each edge so the off-screen icons waiting
            to be dragged in read as an intentional "there's more". The icon set is rendered
            twice back to back so the auto-scroll loop (below) can wrap seamlessly, and chip/icon
            sizes step up at the md breakpoint for tablets vs phones. */}
        <div
          ref={trayRef}
          className="no-scrollbar -mx-6 my-auto flex w-[calc(100%+3rem)] gap-5 overflow-x-auto overscroll-x-contain px-6 py-2 xl:hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)',
          }}
        >
          {[...skills, ...skills].map(({ Icon, color, url }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-fg/5 md:h-28 md:w-28"
              aria-label={url.replace(/^https?:\/\//, '')}
            >
              <Icon className="h-9.5 w-9.5 md:h-13.5 md:w-13.5" style={{ color }} />
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
