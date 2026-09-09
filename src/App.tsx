import { useState } from 'react'
import { CursorHalo } from './components/CursorHalo'
import { Hero } from './components/Hero'
import { SkillScatter } from './components/SkillScatter'
import { SkillTray } from './components/SkillTray'
import { useCursorLight } from './hooks/useCursorLight'
import { useTrayAutoScroll } from './hooks/useTrayAutoScroll'
import { layoutSkills } from './utils/layoutSkills'

function App() {
  const [skills] = useState(() => layoutSkills(window.innerWidth, window.innerHeight))
  const { haloRef, setIconRef, setTextRef } = useCursorLight()
  const trayRef = useTrayAutoScroll<HTMLDivElement>()

  return (
    <main className="relative min-h-svh cursor-default overflow-hidden bg-bg font-sans text-fg antialiased">
      <CursorHalo ref={haloRef} />
      <SkillScatter skills={skills} setIconRef={setIconRef} />

      <div className="relative z-10 flex min-h-svh flex-col items-center px-6 pt-[16vh] text-center pointer-events-none">
        <Hero setTextRef={setTextRef} />
        <SkillTray ref={trayRef} skills={skills} />
      </div>
    </main>
  )
}

export default App
