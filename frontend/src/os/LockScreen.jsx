import { useEffect, useState } from 'react';
import { ChevronUp, Lock, Fingerprint } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDate(date) {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export default function LockScreen({ onUnlock }) {
  const [clock, setClock] = useState(new Date());
  const [drag, setDrag] = useState(0);
  const [startY, setStartY] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const hh = String(clock.getHours()).padStart(2, '0');
  const mm = String(clock.getMinutes()).padStart(2, '0');

  const endDrag = () => {
    if (drag < -80) onUnlock();
    setDrag(0);
    setStartY(null);
  };

  return (
    <div
      className="lock"
      style={{ '--drag': `${drag}px` }}
      onPointerDown={(e) => {
        setStartY(e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startY === null) return;
        setDrag(Math.min(0, e.clientY - startY));
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="lock-grabber" />
      <div className="lock-top">
        <Lock size={15} />
        <span>BananaOS</span>
      </div>

      <div className="lock-content" style={{ transform: `translateY(${drag * 0.55}px)` }}>
        <div className="lock-date">{formatDate(clock)}</div>
        <div className="lock-clock">
          {hh}:{mm}
        </div>

        <div className="lock-notifications">
          <div className="lock-note">
            <div className="lock-note-head">
              <span className="lock-note-app">Messages</span>
              <span className="lock-note-time">26m ago</span>
            </div>
            <p>
              <strong>Mum:</strong> Also your dad found the old photo album 🙂
            </p>
          </div>
          <div className="lock-note">
            <div className="lock-note-head">
              <span className="lock-note-app">Calendar</span>
              <span className="lock-note-time">Today</span>
            </div>
            <p>Climbing wall with Priya · 18:30</p>
          </div>
        </div>
      </div>

      <div className="lock-actions">
        <button className="lock-flashlight" aria-label="Flashlight" type="button">
          <Fingerprint size={18} />
        </button>
        <button className="lock-unlock" onClick={onUnlock}>
          <ChevronUp size={16} />
          Swipe up to unlock
        </button>
      </div>
    </div>
  );
}
