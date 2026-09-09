import { SKILLS } from '../data/skills'
import type { Bounds, PlacedSkill } from '../types'
import {
  CONTENT_ZONE_X_MAX_RATIO,
  CONTENT_ZONE_X_MIN_RATIO,
  CONTENT_ZONE_Y_MAX_RATIO,
  CONTENT_ZONE_Y_MIN_RATIO,
  ICON_GAP_PX,
  ICON_ROTATION_PAD,
  LAYOUT_PLACEMENT_ATTEMPTS,
  MAX_ICON_ROTATE_DEG,
} from '../constants'
import { mulberry32 } from './random'

function regionsFor(vw: number, vh: number, r: number, content: Bounds): { bounds: Bounds; area: number }[] {
  const candidates: Bounds[] = [
    { xMin: r, xMax: content.xMin - r, yMin: r, yMax: vh - r },
    { xMin: content.xMax + r, xMax: vw - r, yMin: r, yMax: vh - r },
    { xMin: r, xMax: vw - r, yMin: r, yMax: content.yMin - r },
    { xMin: r, xMax: vw - r, yMin: content.yMax + r, yMax: vh - r },
  ]
  return candidates
    .filter((bounds) => bounds.xMax > bounds.xMin && bounds.yMax > bounds.yMin)
    .map((bounds) => ({ bounds, area: (bounds.xMax - bounds.xMin) * (bounds.yMax - bounds.yMin) }))
}

export function layoutSkills(viewportWidth: number, viewportHeight: number): PlacedSkill[] {
  const rand = mulberry32(Date.now())
  const vw = viewportWidth
  const vh = viewportHeight

  const content: Bounds = {
    xMin: vw * CONTENT_ZONE_X_MIN_RATIO,
    xMax: vw * CONTENT_ZONE_X_MAX_RATIO,
    yMin: vh * CONTENT_ZONE_Y_MIN_RATIO,
    yMax: vh * CONTENT_ZONE_Y_MAX_RATIO,
  }

  const placed: { x: number; y: number; r: number }[] = []
  const ordered = [...SKILLS].sort((a, b) => b.size - a.size)
  const results: PlacedSkill[] = []

  for (const skill of ordered) {
    const r = (skill.size / 2) * ICON_ROTATION_PAD
    const regions = regionsFor(vw, vh, r, content)
    let best = { x: vw / 2, y: vh / 2, clearance: -Infinity }

    for (let attempt = 0; attempt < LAYOUT_PLACEMENT_ATTEMPTS; attempt++) {
      let x: number
      let y: number

      if (regions.length > 0) {
        const totalArea = regions.reduce((sum, region) => sum + region.area, 0)
        let pick = rand() * totalArea
        let region = regions[regions.length - 1].bounds
        for (const candidate of regions) {
          if (pick < candidate.area) {
            region = candidate.bounds
            break
          }
          pick -= candidate.area
        }
        x = region.xMin + rand() * (region.xMax - region.xMin)
        y = region.yMin + rand() * (region.yMax - region.yMin)
      } else {
        x = r + rand() * Math.max(1, vw - r * 2)
        y = r + rand() * Math.max(1, vh - r * 2)
      }

      let clearance = Infinity
      for (const p of placed) {
        clearance = Math.min(clearance, Math.hypot(x - p.x, y - p.y) - r - p.r - ICON_GAP_PX)
      }

      if (clearance > best.clearance) best = { x, y, clearance }
      if (clearance > 0) break
    }

    placed.push({ x: best.x, y: best.y, r })
    results.push({
      ...skill,
      rotate: Math.round(rand() * MAX_ICON_ROTATE_DEG * 2 - MAX_ICON_ROTATE_DEG),
      top: `${(best.y / vh) * 100}%`,
      left: `${(best.x / vw) * 100}%`,
    })
  }

  return results
}
