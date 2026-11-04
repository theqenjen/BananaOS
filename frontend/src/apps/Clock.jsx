import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X, Play, Pause, RotateCcw, Flag } from 'lucide-react';

const CITIES = [
  { city: 'London', zone: 'Europe/London', label: 'Home' },
  { city: 'New York', zone: 'America/New_York', label: '−5h' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', label: '+9h' },
  { city: 'Sydney', zone: 'Australia/Sydney', label: '+11h' },
  { city: 'Lisbon', zone: 'Europe/Lisbon', label: 'Same' },
];

const TABS = ['World Clock', 'Alarm', 'Stopwatch', 'Timer'];

const pad = (n) => String(n).padStart(2, '0');
const clockFmt = (seconds) => `${pad(Math.floor(seconds / 60))}:${pad(Math.floor(seconds % 60))}`;
const stopwatchFmt = (ms) => {
  const total = Math.floor(ms / 10);
  const cs = total % 100;
  const s = Math.floor(total / 100) % 60;
  const m = Math.floor(total / 6000) % 60;
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
};

export default function ClockApp() {
  const [tab, setTab] = useState('World Clock');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Clock</h1>
          <p className="app-head-sub">BananaOS · London</p>
        </div>
      </header>

      <div className="segmented clock-tabs">
        {TABS.map((item) => (
          <button key={item} type="button" className={tab === item ? 'is-on' : ''} onClick={() => setTab(item)}>
            {item.split(' ')[0]}
          </button>
        ))}
      </div>

      {tab === 'World Clock' && <WorldClocks now={now} />}
      {tab === 'Alarm' && <Alarms />}
      {tab === 'Stopwatch' && <Stopwatch />}
      {tab === 'Timer' && <Timer />}
    </div>
  );
}

function WorldClocks({ now }) {
  return (
    <div className="clock-body">
      <div className="world-hero">
        <span className="world-hero-label">Local time</span>
        <strong>
          {pad(now.getHours())}:{pad(now.getMinutes())}
        </strong>
        <span>{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>

      <div className="list">
        {CITIES.map(({ city, zone, label }) => {
          const time = now.toLocaleTimeString('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit' });
          const date = now.toLocaleDateString('en-GB', { timeZone: zone, weekday: 'short' });
          return (
            <div key={city} className="row world-row">
              <div className="row-main">
                <div className="row-title">{city}</div>
                <div className="row-sub">
                  {label} · {date}
                </div>
              </div>
              <span className="world-time">{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Alarms() {
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:00', label: 'Weekdays', days: 'Mon – Fri', on: true },
    { id: 2, time: '09:30', label: 'Weekend lie-in', days: 'Sat, Sun', on: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  const toggle = (id) => setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, on: !alarm.on } : alarm)));

  const save = () => {
    setAlarms((prev) => [
      ...prev,
      { id: Date.now(), time: `${pad(hour)}:${pad(minute)}`, label: 'Alarm', days: 'Every day', on: true },
    ]);
    setAdding(false);
  };

  return (
    <div className="clock-body">
      <div className="alarm-head">
        <span className="section-label" style={{ padding: '0 0 0 4px' }}>
          Alarms
        </span>
        <button type="button" className="nav-btn is-accent" onClick={() => setAdding(true)} aria-label="Add alarm">
          <Plus size={16} />
        </button>
      </div>

      <div className="list">
        {alarms.map((alarm) => (
          <div key={alarm.id} className="row alarm-row">
            <div className="row-main">
              <div className={`alarm-time ${alarm.on ? '' : 'is-off'}`}>{alarm.time}</div>
              <div className="row-sub">
                {alarm.label} · {alarm.days}
              </div>
            </div>
            <button
              type="button"
              className={`switch ${alarm.on ? 'is-on' : ''}`}
              onClick={() => toggle(alarm.id)}
              aria-label={`Toggle alarm ${alarm.time}`}
            />
          </div>
        ))}
      </div>

      {adding && (
        <div className="sheet-layer">
          <div className="sheet-scrim" onClick={() => setAdding(false)} />
          <div className="sheet">
            <div className="sheet-grabber" />
            <div className="sheet-head">
              <h3 className="sheet-title">New alarm</h3>
              <button type="button" className="nav-btn" onClick={() => setAdding(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="alarm-picker">
              <div className="alarm-spin">
                <button type="button" onClick={() => setHour((h) => (h + 1) % 24)} aria-label="Hour up">
                  +
                </button>
                <span>{pad(hour)}</span>
                <button type="button" onClick={() => setHour((h) => (h + 23) % 24)} aria-label="Hour down">
                  −
                </button>
              </div>
              <strong>:</strong>
              <div className="alarm-spin">
                <button type="button" onClick={() => setMinute((m) => (m + 5) % 60)} aria-label="Minute up">
                  +
                </button>
                <span>{pad(minute)}</span>
                <button type="button" onClick={() => setMinute((m) => (m + 55) % 60)} aria-label="Minute down">
                  −
                </button>
              </div>
            </div>
            <button type="button" className="btn-primary alarm-save" onClick={save}>
              Save alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const timer = setInterval(() => setElapsed(baseRef.current + (Date.now() - startRef.current)), 30);
    return () => clearInterval(timer);
  }, [running]);

  const toggle = () => {
    if (running) {
      baseRef.current += Date.now() - startRef.current;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
    setLaps([]);
  };

  return (
    <div className="clock-body stopwatch">
      <div className="stopwatch-display">{stopwatchFmt(elapsed)}</div>
      <div className="stopwatch-actions">
        <button type="button" className="stopwatch-btn" onClick={() => (running || elapsed > 0 ? setLaps((prev) => [elapsed, ...prev]) : null)}>
          <Flag size={17} /> Lap
        </button>
        <button type="button" className={`stopwatch-btn is-main ${running ? 'is-stop' : ''}`} onClick={toggle}>
          {running ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button type="button" className="stopwatch-btn" onClick={reset}>
          <RotateCcw size={17} /> Reset
        </button>
      </div>

      <div className="lap-list">
        {laps.map((lap, index) => (
          <div key={`${lap}-${index}`} className="lap-row">
            <span>Lap {laps.length - index}</span>
            <strong>{stopwatchFmt(lap)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRESETS = [1, 3, 5, 10, 15, 25];

function Timer() {
  const [total, setTotal] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const pick = (minutes) => {
    setTotal(minutes * 60);
    setRemaining(minutes * 60);
    setRunning(false);
    setDone(false);
  };

  const progress = total ? Math.min(1, 1 - remaining / total) : 0;

  return (
    <div className="clock-body timer">
      <div className={`timer-ring ${done ? 'is-done' : ''}`} style={{ '--progress': `${progress * 360}deg` }}>
        <div className="timer-inner">
          <span>{clockFmt(remaining)}</span>
          <small>{done ? 'Timer ended' : running ? 'Running' : 'Paused'}</small>
        </div>
      </div>

      <div className="timer-controls">
        <button type="button" className="btn-ghost" onClick={() => pick(total / 60)}>
          <RotateCcw size={14} /> Reset
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            if (done) {
              pick(total / 60);
              return;
            }
            setRunning((value) => !value);
          }}
        >
          {done ? 'Restart' : running ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="chips timer-presets">
        {PRESETS.map((minutes) => (
          <button key={minutes} type="button" className={total === minutes * 60 ? 'is-on' : ''} onClick={() => pick(minutes)}>
            {minutes}m
          </button>
        ))}
      </div>
    </div>
  );
}
