import { useEffect, useRef } from 'react'
import {
  ICON_GLOW_BLUR_PX,
  ICON_LIGHT_RADIUS_PX,
  ICON_SHADOW_BLUR_PX,
  ICON_SHADOW_OPACITY,
  INITIAL_LIGHT_Y_RATIO,
} from '../constants'

export function useCursorLight() {
  const haloRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLElement | null)[]>([])
  const textRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    let frame = 0

    const update = (clientX: number, clientY: number) => {
      const halo = haloRef.current
      if (halo) {
        halo.style.setProperty('--hx', `${clientX}px`)
        halo.style.setProperty('--hy', `${clientY}px`)
      }

      for (const el of iconRefs.current) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2))
        const t = Math.max(0, 1 - dist / ICON_LIGHT_RADIUS_PX)
        const opacity = t * t
        el.style.opacity = String(opacity)
        el.style.filter = `drop-shadow(0 0 ${ICON_SHADOW_BLUR_PX}px rgba(0,0,0,${ICON_SHADOW_OPACITY})) drop-shadow(0 0 ${ICON_GLOW_BLUR_PX * opacity}px currentColor)`
      }

      for (const el of textRefs.current) {
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

    update(window.innerWidth / 2, window.innerHeight * INITIAL_LIGHT_Y_RATIO)
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

  const setIconRef = (index: number) => (el: HTMLElement | null) => {
    iconRefs.current[index] = el
  }

  const setTextRef = (index: number) => (el: HTMLElement | null) => {
    textRefs.current[index] = el
  }

  return { haloRef, setIconRef, setTextRef }
}
