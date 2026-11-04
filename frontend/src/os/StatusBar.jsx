import { useEffect, useState } from 'react';
import { Wifi, Plane } from 'lucide-react';
import { useDevice } from '../state/DeviceContext.jsx';

export default function StatusBar({ tint = 'auto', onOpenControlCenter }) {
  const { settings, battery, charging } = useDevice();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const connected = !settings.airplane;

  return (
    <div className={`statusbar tint-${tint}`}>
      <button className="sb-time" onClick={onOpenControlCenter} type="button" aria-label="Open Control Centre">
        {time}
      </button>
      <div className="island" aria-hidden="true" />
      <button className="sb-right" onClick={onOpenControlCenter} type="button" aria-label="Status">
        {settings.dnd && <span className="sb-dnd">DND</span>}
        {connected ? (
          <>
            <span className={`sb-signal bars-${settings.airplane ? 0 : 4}`} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <Wifi size={15} strokeWidth={2.4} />
          </>
        ) : (
          <Plane size={15} strokeWidth={2.4} />
        )}
        <span className={`sb-battery ${charging ? 'is-charging' : ''}`} aria-label={`${battery}% battery`}>
          <span className="sb-battery-level" style={{ width: `${Math.max(8, battery)}%` }} />
        </span>
      </button>
    </div>
  );
}
