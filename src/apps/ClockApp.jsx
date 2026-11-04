import { useEffect, useRef, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { clockTime, longDate } from '../os/utils'

const WORLD_CLOCKS = [
  { city: 'London', zone: 'Europe/London' },
  { city: 'New York', zone: 'America/New_York' },
  { city: 'Tokyo', zone: 'Asia/Tokyo' },
  { city: 'Sydney', zone: 'Australia/Sydney' },
]

function analogAngles(date) {
  const seconds = date.getSeconds() * 6
  const minutes = date.getMinutes() * 6 + date.getSeconds() * 0.1
  const hours = (date.getHours() % 12) * 30 + date.getMinutes() * 0.5
  return { seconds, minutes, hours }
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const frame = useRef(null)
  const startedAt = useRef(0)
  const base = useRef(0)

  useEffect(() => {
    if (!running) return
    startedAt.current = performance.now()
    const tick = () => {
      setElapsed(base.current + (performance.now() - startedAt.current))
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [running])

  const total = Math.floor(elapsed)
  const minutes = String(Math.floor(total / 60000)).padStart(2, '0')
  const seconds = String(Math.floor((total % 60000) / 1000)).padStart(2, '0')
  const hundredths = String(Math.floor((total % 1000) / 10)).padStart(2, '0')

  return (
    <div className="stopwatch">
      <div className="stopwatch-time">
        {minutes}:{seconds}
        <span>.{hundredths}</span>
      </div>
      <div className="stopwatch-actions">
        <button
          type="button"
          className={running ? 'sw-stop' : 'sw-start'}
          onClick={() => {
            if (running) {
              base.current += performance.now() - startedAt.current
              setRunning(false)
            } else {
              setRunning(true)
            }
          }}
        >
          {running ? 'Stop' : elapsed ? 'Resume' : 'Start'}
        </button>
        <button
          type="button"
          className="sw-reset"
          onClick={() => {
            setRunning(false)
            base.current = 0
            setElapsed(0)
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export function ClockApp() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { seconds, minutes, hours } = analogAngles(now)

  return (
    <AppShell className="clock-app" title="Clock" subtitle={longDate(now)}>
      <div className="clock-card">
        <svg viewBox="0 0 200 200" className="analog" role="img" aria-label="Analog clock">
          <circle cx="100" cy="100" r="94" className="analog-face" />
          {Array.from({ length: 12 }).map((_, index) => (
            <line
              key={index}
              x1="100"
              y1="14"
              x2="100"
              y2={index % 3 === 0 ? 26 : 21}
              className="analog-tick"
              transform={`rotate(${index * 30} 100 100)`}
            />
          ))}
          <line x1="100" y1="100" x2="100" y2="56" className="analog-hour" transform={`rotate(${hours} 100 100)`} />
          <line x1="100" y1="100" x2="100" y2="34" className="analog-minute" transform={`rotate(${minutes} 100 100)`} />
          <line x1="100" y1="112" x2="100" y2="28" className="analog-second" transform={`rotate(${seconds} 100 100)`} />
          <circle cx="100" cy="100" r="4.5" className="analog-pin" />
        </svg>
        <div className="clock-digital">{clockTime(now)}</div>
      </div>

      <div className="card">
        <h2 className="card-title">World clock</h2>
        {WORLD_CLOCKS.map((city) => (
          <div key={city.city} className="row">
            <span>{city.city}</span>
            <span className="row-value">
              {now.toLocaleTimeString('en-GB', {
                timeZone: city.zone,
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Stopwatch</h2>
        <Stopwatch />
      </div>
    </AppShell>
  )
}
