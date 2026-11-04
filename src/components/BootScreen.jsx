import { useEffect, useState } from 'react'
import { BananaMark } from './AppIcon'

export function BootScreen({ onSkip }) {
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 96 ? 96 : p + Math.random() * 22))
    }, 160)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="boot" onClick={onSkip} role="presentation">
      <div className="boot-mark">
        <BananaMark size={86} />
      </div>
      <div className="boot-word">BananaOS</div>
      <div className="boot-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="boot-meta">ARM64 · version 1.0 (build 24B71)</div>
    </div>
  )
}
