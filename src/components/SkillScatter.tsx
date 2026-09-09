import type { PlacedSkill } from '../types'
import { labelFromUrl } from '../utils/url'

interface SkillScatterProps {
  skills: PlacedSkill[]
  setIconRef: (index: number) => (el: HTMLElement | null) => void
}

export function SkillScatter({ skills, setIconRef }: SkillScatterProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden xl:block">
      {skills.map(({ Icon, color, top, left, size, rotate, url }, index) => (
        <span
          key={url}
          ref={setIconRef(index)}
          className="absolute opacity-0"
          style={{ top, left, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto block cursor-pointer"
            aria-label={labelFromUrl(url)}
          >
            <Icon style={{ width: size, height: size, color }} />
          </a>
        </span>
      ))}
    </div>
  )
}
