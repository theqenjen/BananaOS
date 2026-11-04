import { useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'

export function HomeIndicator() {
  const { ui, actions } = useOS()
  const [drag, setDrag] = useState(0)
  const startY = useRef(null)

  const onPointerDown = (event) => {
    startY.current = event.clientY
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      /* synthetic or already-released pointer */
    }
  }

  const onPointerMove = (event) => {
    if (startY.current === null) return
    setDrag(Math.min(0, event.clientY - startY.current))
  }

  const finish = () => {
    const distance = drag
    startY.current = null
    setDrag(0)
    if (distance < -28) {
      actions.openSwitcher()
      return
    }
    if (ui.activeApp || ui.switcher) actions.goHome()
  }

  return (
    <div
      className="home-indicator"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      role="button"
      tabIndex={0}
      aria-label="Home"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') actions.goHome()
      }}
    >
      <span className="home-pill" style={{ transform: `translateY(${drag * 0.35}px)` }} />
    </div>
  )
}
