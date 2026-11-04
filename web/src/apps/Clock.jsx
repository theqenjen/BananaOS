import React, { useEffect, useState } from 'react';
import { AppFrame } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { hhmmss, mmss, useNow } from '../os/hooks';

const ZONES = [
  { label: 'London', zone: 'Europe/London' },
  { label: 'New York', zone: 'America/New_York' },
  { label: 'Tokyo', zone: 'Asia/Tokyo' },
  { label: 'Sydney', zone: 'Australia/Sydney' },
];

const PRESETS = [1, 3, 5, 10, 25];

function WorldClock() {
  const now = useNow(1000);
  return (
    <div className="list-view">
      <div className="world-card primary">
        <span className="world-label">Local time</span>
        <span className="world-time">
          {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="world-date">
          {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>
      {ZONES.map((item) => (
        <div key={item.zone} className="list-row static">
          <span className="row-main">
            <span className="row-title">{item.label}</span>
            <span className="row-sub">
              {now.toLocaleDateString('en-GB', { timeZone: item.zone, weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </span>
          <span className="row-value">
            {now.toLocaleTimeString('en-GB', { timeZone: item.zone, hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimerTab() {
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
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

  const start = (seconds) => {
    setDone(false);
    setRemaining(seconds);
    setRunning(true);
  };

  return (
    <div className="timer-tab">
      <div className="timer-dial">
        <span className={done ? 'timer-value done' : 'timer-value'}>{mmss(remaining)}</span>
        <span className="timer-note">{done ? 'Time’s up — banana ready 🍌' : running ? 'Running' : 'Timer'}</span>
      </div>
      <div className="preset-row">
        {PRESETS.map((minutes) => (
          <button type="button" key={minutes} className="preset" onClick={() => start(minutes * 60)}>
            {minutes}m
          </button>
        ))}
      </div>
      <div className="timer-actions">
        <button type="button" className="pill-button" onClick={() => (running ? setRunning(false) : setRunning(true))} disabled={!remaining && !running}>
          <Icon name={running ? 'pause' : 'play'} size={16} /> {running ? 'Pause' : 'Resume'}
        </button>
        <button
          type="button"
          className="pill-button ghost"
          onClick={() => {
            setRunning(false);
            setDone(false);
            setRemaining(300);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function StopwatchTab() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setElapsed((value) => value + 0.1), 100);
    return () => clearInterval(timer);
  }, [running]);

  return (
    <div className="timer-tab">
      <div className="timer-dial">
        <span className="timer-value mono">{hhmmss(elapsed)}</span>
        <span className="timer-note">Stopwatch</span>
      </div>
      <div className="timer-actions">
        <button type="button" className="pill-button" onClick={() => setRunning((value) => !value)}>
          <Icon name={running ? 'pause' : 'play'} size={16} /> {running ? 'Stop' : 'Start'}
        </button>
        <button
          type="button"
          className="pill-button ghost"
          onClick={() => {
            if (running) setLaps((list) => [elapsed, ...list].slice(0, 12));
            else {
              setElapsed(0);
              setLaps([]);
            }
          }}
        >
          {running ? 'Lap' : 'Reset'}
        </button>
      </div>
      <div className="lap-list">
        {laps.map((lap, index) => (
          <div key={`${lap}-${index}`} className="lap-row">
            <span>Lap {laps.length - index}</span>
            <span className="mono">{hhmmss(lap)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Clock() {
  const [tab, setTab] = useState('clock');

  return (
    <AppFrame title="Clock" bodyClassName="clock-body">
      <div className="segmented">
        {[
          ['clock', 'World'],
          ['timer', 'Timer'],
          ['stopwatch', 'Stopwatch'],
        ].map(([id, label]) => (
          <button type="button" key={id} className={`segment ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'clock' && <WorldClock />}
      {tab === 'timer' && <TimerTab />}
      {tab === 'stopwatch' && <StopwatchTab />}
    </AppFrame>
  );
}
