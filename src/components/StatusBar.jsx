import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'
import { Glyph } from '../os/Glyph'
import { clockTime } from '../os/utils'

export function StatusBar({ interactive = false }) {
  const { data, actions } = useOS()
  const [now, setNow] = useState(new Date())
  const startY = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(timer)
  }, [])

  const airplane = data.settings.airplane

  const onPointerDown = (event) => {
    if (!interactive) return
    startY.current = event.clientY
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      /* synthetic or already-released pointer */
    }
  }

  const onPointerUp = (event) => {
    if (!interactive || startY.current === null) return
    const distance = event.clientY - startY.current
    startY.current = null
    if (distance > 26) actions.setControlCenter(true)
  }

  return (
    <div
      className={`status-bar ${interactive ? 'is-interactive' : ''}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={interactive ? () => actions.setControlCenter(true) : undefined}
    >
      <span className="status-time">{clockTime(now)}</span>
      <span className="status-icons">
        {airplane ? (
          <Glyph name="globe" size={15} strokeWidth={2} />
        ) : (
          <>
            <Glyph name="signal" size={16} strokeWidth={2.1} />
            {data.settings.wifi && <Glyph name="wifi" size={16} strokeWidth={2.1} />}
          </>
        )}
        <span className="status-battery">
          <span className="battery-shell">
            <span className="battery-fill" style={{ width: `${data.battery}%` }} />
          </span>
          <span className="battery-cap" />
          <span className="battery-text">{data.battery}%</span>
        </span>
      </span>
    </div>
  )
}

export function Island() {
  return (
    <div className="island" aria-hidden="true">
      <span className="island-lens" />
    </div>
  )
}
