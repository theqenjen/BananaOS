import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const dateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

function seedEvents() {
  const base = new Date();
  const make = (offset, time, title, place, color) => {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    return { key: dateKey(date), time, title, place, color };
  };
  return [
    make(0, '18:30', 'Climbing wall with Priya', 'Castle Leisure Centre', '#B07CF7'),
    make(0, '10:15', 'Team standup', 'Banana Labs · Room 2', '#4F8CF7'),
    make(2, '09:00', 'Dentist', 'Peel Street Dental', '#34D399'),
    make(4, '19:30', "Mum's birthday dinner", 'The Yellow House', '#F2A65A'),
    make(9, '14:00', 'Design review', 'Video call', '#FFD34E'),
    make(14, '11:00', 'Saturday market', 'Borough Yard', '#38B98A'),
  ];
}

export default function CalendarApp() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const events = useMemo(seedEvents, []);

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < offset; i += 1) cells.push(null);
    for (let day = 1; day <= days; day += 1) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const selectedEvents = events.filter((event) => event.key === dateKey(selected));
  const isToday = (date) => date && dateKey(date) === dateKey(today);

  return (
    <div className="calendar">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Calendar</h1>
          <p className="app-head-sub">
            {events.length} events this month · {today.getFullYear()}
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost calendar-today"
          onClick={() => {
            setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
            setSelected(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
          }}
        >
          Today
        </button>
      </header>

      <div className="calendar-monthbar">
        <button type="button" className="nav-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <strong>
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </strong>
        <button type="button" className="nav-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day[0]}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {grid.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className="calendar-cell is-empty" />;
          const dayEvents = events.filter((event) => event.key === dateKey(date));
          const active = dateKey(date) === dateKey(selected);
          return (
            <button
              key={dateKey(date)}
              type="button"
              className={`calendar-cell ${active ? 'is-selected' : ''} ${isToday(date) ? 'is-today' : ''}`}
              onClick={() => setSelected(date)}
            >
              <span>{date.getDate()}</span>
              {dayEvents.length > 0 && <i style={{ background: dayEvents[0].color }} />}
            </button>
          );
        })}
      </div>

      <div className="calendar-agenda">
        <span className="section-label" style={{ padding: '0 0 8px 2px' }}>
          {selected.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
        {selectedEvents.length === 0 && <p className="calendar-empty">Nothing scheduled. A rare and beautiful thing.</p>}
        {selectedEvents.map((event) => (
          <div key={event.title} className="agenda-row">
            <span className="agenda-dot" style={{ background: event.color }} />
            <div>
              <strong>{event.title}</strong>
              <span>
                {event.time} · {event.place}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
