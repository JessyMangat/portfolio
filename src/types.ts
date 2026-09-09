import type { IconType } from 'react-icons'

export interface Skill {
  Icon: IconType
  color: string
  size: number
  url: string
}

export interface PlacedSkill extends Skill {
  rotate: number
  top: string
  left: string
}

export interface Bounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}
