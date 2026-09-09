import type { Ref } from 'react'
import { HALO_OPACITY, HALO_RADIUS_PX } from '../constants'

interface CursorHaloProps {
  ref: Ref<HTMLDivElement>
}

export function CursorHalo({ ref }: CursorHaloProps) {
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(${HALO_RADIUS_PX}px circle at var(--hx, -9999px) var(--hy, -9999px), rgba(255,255,255,${HALO_OPACITY}), transparent 60%)`,
      }}
    />
  )
}
