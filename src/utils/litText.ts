import type { CSSProperties } from 'react'
import {
  TEXT_LIGHT_INNER_COLOR,
  TEXT_LIGHT_MID_COLOR,
  TEXT_LIGHT_MID_STOP_PERCENT,
  TEXT_LIGHT_OUTER_STOP_PERCENT,
  TEXT_LIGHT_RADIUS_PX,
} from '../constants'

export function litTextStyle(restColor: string): CSSProperties {
  return {
    backgroundImage: `radial-gradient(${TEXT_LIGHT_RADIUS_PX}px circle at var(--mx, -9999px) var(--my, -9999px), ${TEXT_LIGHT_INNER_COLOR} 0%, ${TEXT_LIGHT_MID_COLOR} ${TEXT_LIGHT_MID_STOP_PERCENT}%, ${restColor} ${TEXT_LIGHT_OUTER_STOP_PERCENT}%)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }
}
