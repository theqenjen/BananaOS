import { useState } from 'react'
import { AppShell } from '../components/AppShell'
import { Glyph } from '../os/Glyph'
import { longDate } from '../os/utils'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const EVENTS = {
  '19:30': 'Dinner with Maya · Banana Leaf',
  '09:15': 'Standup · 15 min',
}

export function CalendarApp() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(today.getDate())

  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const shift = (delta) => {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
    setSelected(1)
  }

  const selectedIsToday = isToday(selected)

  return (
    <AppShell className="calendar-app" title="Calendar" subtitle={`${year}`}>
      <div className="card calendar-card">
        <div className="calendar-head">
          <button type="button" className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">
            <Glyph name="back" size={17} strokeWidth={2.1} />
          </button>
          <strong>
            {new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long' })} {year}
          </strong>
          <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label="Next month">
            <Glyph name="chevronRight" size={17} strokeWidth={2.1} />
          </button>
        </div>

        <div className="calendar-grid calendar-weekdays">
          {WEEKDAYS.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((day, index) =>
            day === null ? (
              <span key={`empty-${index}`} />
            ) : (
              <button
                type="button"
                key={day}
                className={`calendar-day ${isToday(day) ? 'is-today' : ''} ${
                  selected === day ? 'is-selected' : ''
                }`}
                onClick={() => setSelected(day)}
              >
                {day}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          {new Date(year, month, selected).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </h2>
        {selectedIsToday ? (
          Object.entries(EVENTS).map(([time, title]) => (
            <div key={time} className="event-row">
              <span className="event-time">{time}</span>
              <span className="event-bar" />
              <span className="event-title">{title}</span>
            </div>
          ))
        ) : (
          <p className="muted">No events scheduled.</p>
        )}
        <p className="muted small">{longDate(new Date(year, month, selected))}</p>
      </div>
    </AppShell>
  )
}
