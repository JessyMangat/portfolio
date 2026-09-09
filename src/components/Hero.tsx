import {
  EMAIL,
  EMAIL_HREF,
  GITHUB_LABEL,
  GITHUB_URL,
  HERO_NAME,
  HERO_TITLE,
  LINK_REST_COLOR,
  NAME_REST_COLOR,
  SUBTITLE_REST_COLOR,
} from '../constants'
import { litTextStyle } from '../utils/litText'

interface HeroProps {
  setTextRef: (index: number) => (el: HTMLElement | null) => void
}

export function Hero({ setTextRef }: HeroProps) {
  return (
    <>
      <h1
        ref={setTextRef(0)}
        style={litTextStyle(NAME_REST_COLOR)}
        className="rise-in pointer-events-auto font-display text-6xl leading-none font-bold sm:text-7xl"
      >
        {HERO_NAME}
      </h1>

      <p
        ref={setTextRef(1)}
        style={litTextStyle(SUBTITLE_REST_COLOR)}
        className="rise-in pointer-events-auto mt-3 font-mono text-xs tracking-widest uppercase [animation-delay:100ms]"
      >
        {HERO_TITLE}
      </p>

      <div className="rise-in pointer-events-auto mt-8 flex flex-col gap-3 font-mono text-sm sm:flex-row sm:gap-6 [animation-delay:180ms]">
        <a
          ref={setTextRef(2)}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={litTextStyle(LINK_REST_COLOR)}
          className="cursor-pointer underline decoration-fg/20 underline-offset-4"
        >
          {GITHUB_LABEL}
        </a>
        <a
          ref={setTextRef(3)}
          href={EMAIL_HREF}
          style={litTextStyle(LINK_REST_COLOR)}
          className="cursor-pointer underline decoration-fg/20 underline-offset-4"
        >
          {EMAIL}
        </a>
      </div>
    </>
  )
}
