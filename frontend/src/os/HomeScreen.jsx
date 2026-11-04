import { useRef, useState } from 'react';
import { CloudSun, MapPin } from 'lucide-react';
import { APPS } from './apps.js';

const DOCK = APPS.filter((app) => app.dock);
const GRID = APPS.filter((app) => !app.dock);

function AppIcon({ app, onOpen }) {
  const Icon = app.icon;
  return (
    <button className="app-icon" type="button" aria-label={app.name} onClick={() => onOpen(app.id)}>
      <span className="app-icon-tile" style={{ background: app.tint }}>
        <Icon size={30} strokeWidth={1.9} />
      </span>
      <span className="app-icon-name">{app.name}</span>
    </button>
  );
}

export default function HomeScreen({ onOpen }) {
  const [page, setPage] = useState(0);
  const scroller = useRef(null);
  const clock = new Date();

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="home">
      <div className="home-pages" ref={scroller} onScroll={onScroll}>
        <section className="home-page">
          <div className="app-grid">
            {GRID.map((app) => (
              <AppIcon key={app.id} app={app} onOpen={onOpen} />
            ))}
          </div>
        </section>

        <section className="home-page">
          <div className="widget-stack">
            <button className="widget weather-widget" type="button" onClick={() => onOpen('weather')}>
              <div className="ww-top">
                <span className="ww-city">
                  <MapPin size={12} /> London
                </span>
                <CloudSun size={26} />
              </div>
              <div className="ww-temp">14°</div>
              <div className="ww-desc">Partly cloudy · H 16° L 9°</div>
              <div className="ww-hours">
                <span>Now 14°</span>
                <span>14:00 15°</span>
                <span>16:00 13°</span>
                <span>18:00 11°</span>
              </div>
            </button>

            <button className="widget clock-widget" type="button" onClick={() => onOpen('clock')}>
              <div className="cw-time">
                {String(clock.getHours()).padStart(2, '0')}:{String(clock.getMinutes()).padStart(2, '0')}
              </div>
              <div className="cw-date">
                {clock.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="cw-alarm">⏰ Alarm 07:00 · Weekdays</div>
            </button>

            <button className="widget notes-widget" type="button" onClick={() => onOpen('notes')}>
              <span className="nw-label">Notes</span>
              <span className="nw-title">Groceries</span>
              <span className="nw-body">Oat milk · Bananas (obviously) · Coffee beans</span>
            </button>
          </div>
        </section>
      </div>

      <div className="page-dots">
        {[0, 1].map((index) => (
          <button
            key={index}
            type="button"
            className={page === index ? 'is-on' : ''}
            aria-label={`Home page ${index + 1}`}
            onClick={() => scroller.current?.scrollTo({ left: index * scroller.current.clientWidth, behavior: 'smooth' })}
          />
        ))}
      </div>

      <div className="dock">
        {DOCK.map((app) => (
          <AppIcon key={app.id} app={app} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
