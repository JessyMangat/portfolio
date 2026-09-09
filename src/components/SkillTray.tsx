import type { Ref } from 'react'
import { TRAY_EDGE_FADE_PX } from '../constants'
import type { PlacedSkill } from '../types'
import { labelFromUrl } from '../utils/url'

interface SkillTrayProps {
  ref: Ref<HTMLDivElement>
  skills: PlacedSkill[]
}

export function SkillTray({ ref, skills }: SkillTrayProps) {
  const maskImage = `linear-gradient(to right, transparent, black ${TRAY_EDGE_FADE_PX}px, black calc(100% - ${TRAY_EDGE_FADE_PX}px), transparent)`

  return (
    <div
      ref={ref}
      className="no-scrollbar pointer-events-auto -mx-6 my-auto flex w-[calc(100%+3rem)] gap-5 overflow-x-auto overscroll-x-contain px-6 py-2 xl:hidden"
      style={{ WebkitMaskImage: maskImage, maskImage }}
    >
      {[...skills, ...skills].map(({ Icon, color, url }, index) => (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-fg/5 md:h-28 md:w-28"
          aria-label={labelFromUrl(url)}
        >
          <Icon className="h-9.5 w-9.5 md:h-13.5 md:w-13.5" style={{ color }} />
        </a>
      ))}
    </div>
  )
}
