import type { IconType } from 'react-icons'
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

interface SkillBase {
  Icon: IconType
  color: string
  size: number
}

export interface PlacedSkill extends SkillBase {
  rotate: number
  top: string
  left: string
}

const SKILL_BASE: SkillBase[] = [
  { Icon: SiReact, color: '#61DAFB', size: 110 },
  { Icon: SiGit, color: '#F05032', size: 80 },
  { Icon: SiMongodb, color: '#47A248', size: 110 },
  { Icon: SiLaravel, color: '#FF2D20', size: 90 },
  { Icon: SiSwift, color: '#F05138', size: 95 },
  { Icon: SiKotlin, color: '#7F52FF', size: 85 },
  { Icon: SiTypescript, color: '#3178C6', size: 95 },
  { Icon: SiNodedotjs, color: '#5FA04E', size: 110 },
  { Icon: SiTailwindcss, color: '#38BDF8', size: 90 },
  { Icon: SiFirebase, color: '#FFCA28', size: 95 },
  { Icon: SiPhp, color: '#777BB4', size: 85 },
  { Icon: SiGooglecloud, color: '#4285F4', size: 85 },
  { Icon: SiDocker, color: '#2496ED', size: 75 },
  { Icon: SiJavascript, color: '#F7DF1E', size: 80 },
  { Icon: SiHtml5, color: '#E34F26', size: 80 },
  { Icon: SiNextdotjs, color: '#ffffff', size: 90 },
  { Icon: SiWebrtc, color: '#ffffff', size: 75 },
  { Icon: SiExpress, color: '#ffffff', size: 80 },
  { Icon: SiMysql, color: '#4479A1', size: 85 },
  { Icon: SiSass, color: '#CC6699', size: 85 },
]

// Deterministic PRNG (mulberry32) so a given seed always reproduces the same
// layout — the seed itself is the current date+time, so each page load gets
// its own arrangement.
function mulberry32(seed: number) {
  let state = seed | 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GAP = 18 // minimum clearance between icon edges, in px

// Icons are rendered with a small random rotation, which inflates their
// actual axis-aligned bounding box beyond their nominal size (a rotated
// square needs a bigger box to contain it). All placement geometry below
// uses this padded radius — worst case for the max rotation angle used —
// so the box we reserve always covers what actually gets rendered.
const MAX_ROTATE_DEG = 10
const ROTATION_PAD = Math.abs(Math.cos((MAX_ROTATE_DEG * Math.PI) / 180)) + Math.abs(Math.sin((MAX_ROTATE_DEG * Math.PI) / 180))

interface Bounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/**
 * The four strips surrounding the content rect (left/right run the full
 * height, top/bottom fill the remaining width). Sampling only ever draws
 * from inside one of these, so a candidate can never land inside the
 * content zone in the first place — no rejection-sampling luck required.
 */
function regionsFor(vw: number, vh: number, r: number, content: Bounds): { bounds: Bounds; area: number }[] {
  const candidates: Bounds[] = [
    { xMin: r, xMax: content.xMin - r, yMin: r, yMax: vh - r }, // left
    { xMin: content.xMax + r, xMax: vw - r, yMin: r, yMax: vh - r }, // right
    { xMin: r, xMax: vw - r, yMin: r, yMax: content.yMin - r }, // top
    { xMin: r, xMax: vw - r, yMin: content.yMax + r, yMax: vh - r }, // bottom
  ]
  return candidates
    .filter((b) => b.xMax > b.xMin && b.yMax > b.yMin)
    .map((bounds) => ({ bounds, area: (bounds.xMax - bounds.xMin) * (bounds.yMax - bounds.yMin) }))
}

/**
 * Randomly scatters the skill icons across the viewport with no overlaps —
 * between icons, or with the name/subtitle/links block in the center.
 * Seeded by the current date+time, so the arrangement is fresh per visit but
 * deterministic for that moment.
 */
export function layoutSkills(viewportWidth: number, viewportHeight: number): PlacedSkill[] {
  const rand = mulberry32(Date.now())
  const vw = viewportWidth
  const vh = viewportHeight

  // keep-out zone around the centered name/subtitle/links content
  const content: Bounds = {
    xMin: vw * 0.2,
    xMax: vw * 0.8,
    yMin: vh * 0.05,
    yMax: vh * 0.42,
  }

  const placed: { x: number; y: number; r: number }[] = []
  // place the largest icons first — easier to slot small ones into what's left
  const ordered = [...SKILL_BASE].sort((a, b) => b.size - a.size)
  const results: PlacedSkill[] = []

  for (const skill of ordered) {
    const r = (skill.size / 2) * ROTATION_PAD
    const regions = regionsFor(vw, vh, r, content)
    let best = { x: vw / 2, y: vh / 2, clearance: -Infinity }

    for (let attempt = 0; attempt < 500; attempt++) {
      let x: number
      let y: number

      if (regions.length > 0) {
        // pick a region weighted by its available area, so icons distribute
        // proportionally rather than clumping in the smallest strip
        const totalArea = regions.reduce((sum, r) => sum + r.area, 0)
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
        // icon too large for any clear strip (tiny viewport) — fall back to
        // the full canvas as a last resort so it still gets placed
        x = r + rand() * Math.max(1, vw - r * 2)
        y = r + rand() * Math.max(1, vh - r * 2)
      }

      let clearance = Infinity
      for (const p of placed) {
        clearance = Math.min(clearance, Math.hypot(x - p.x, y - p.y) - r - p.r - GAP)
      }

      if (clearance > best.clearance) best = { x, y, clearance }
      if (clearance > 0) break // fully clear of every other icon — good enough
    }

    placed.push({ x: best.x, y: best.y, r })
    results.push({
      ...skill,
      rotate: Math.round(rand() * MAX_ROTATE_DEG * 2 - MAX_ROTATE_DEG),
      top: `${(best.y / vh) * 100}%`,
      left: `${(best.x / vw) * 100}%`,
    })
  }

  return results
}
