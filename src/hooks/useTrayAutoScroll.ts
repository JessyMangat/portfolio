import { useEffect, useRef } from 'react'
import { TRAY_PAUSE_MS, TRAY_SCROLL_SPEED_PX_PER_FRAME } from '../constants'

export function useTrayAutoScroll<T extends HTMLElement>() {
  const trayRef = useRef<T>(null)

  useEffect(() => {
    const tray = trayRef.current
    if (!tray) return

    let lastInteraction = 0
    let frame = 0
    let position = tray.scrollLeft

    const onInteract = () => {
      lastInteraction = Date.now()
    }
    tray.addEventListener('touchstart', onInteract, { passive: true })
    tray.addEventListener('wheel', onInteract, { passive: true })

    const onScroll = () => {
      const halfWidth = tray.scrollWidth / 2
      if (halfWidth <= 0) return
      if (tray.scrollLeft >= halfWidth) {
        tray.scrollLeft -= halfWidth
      } else if (tray.scrollLeft < 0) {
        tray.scrollLeft += halfWidth
      }
      position = tray.scrollLeft
    }
    tray.addEventListener('scroll', onScroll, { passive: true })

    const step = () => {
      frame = requestAnimationFrame(step)
      if (Date.now() - lastInteraction < TRAY_PAUSE_MS) {
        position = tray.scrollLeft
        return
      }
      position += TRAY_SCROLL_SPEED_PX_PER_FRAME
      tray.scrollLeft = position
    }
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      tray.removeEventListener('touchstart', onInteract)
      tray.removeEventListener('wheel', onInteract)
      tray.removeEventListener('scroll', onScroll)
    }
  }, [])

  return trayRef
}
