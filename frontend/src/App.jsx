import { useCallback, useEffect, useState } from 'react';
import { useDevice, WALLPAPERS } from './state/DeviceContext.jsx';
import { APP_BY_ID } from './os/apps.js';
import BootScreen from './os/BootScreen.jsx';
import LockScreen from './os/LockScreen.jsx';
import HomeScreen from './os/HomeScreen.jsx';
import StatusBar from './os/StatusBar.jsx';
import ControlCenter from './os/ControlCenter.jsx';
import Recents from './os/Recents.jsx';
import AppWindow from './os/AppWindow.jsx';
import HomeBar from './os/HomeBar.jsx';

export default function App() {
  const { settings } = useDevice();
  const [phase, setPhase] = useState('boot');
  const [openApps, setOpenApps] = useState([]);
  const [activeUid, setActiveUid] = useState(null);
  const [controlCenter, setControlCenter] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);

  const openApp = useCallback((appId) => {
    if (!APP_BY_ID[appId]) return;
    setControlCenter(false);
    setRecentsOpen(false);
    setOpenApps((prev) => {
      const existing = prev.find((item) => item.appId === appId);
      if (existing) {
        setActiveUid(existing.uid);
        return prev;
      }
      const uid = `${appId}-${Date.now()}`;
      setActiveUid(uid);
      return [...prev, { uid, appId }];
    });
  }, []);

  useEffect(() => {
    if (phase !== 'home') {
      setActiveUid(null);
      setRecentsOpen(false);
    }
  }, [phase]);

  const goHome = () => {
    setActiveUid(null);
    setControlCenter(false);
    setRecentsOpen(false);
  };

  const dim = Math.max(0, (100 - settings.brightness) / 100) * 0.62;

  return (
    <div className="stage">
      <div className="stage-glow" aria-hidden="true" />
      <div className="device">
        <div className="wallpaper" style={{ background: WALLPAPERS[settings.wallpaper] || WALLPAPERS.dusk }} />
        <div className="wallpaper-grain" aria-hidden="true" />

        {phase === 'boot' && <BootScreen onDone={() => setPhase('lock')} />}

        {phase === 'lock' && (
          <>
            <StatusBar onOpenControlCenter={() => setControlCenter(true)} />
            <LockScreen onUnlock={() => setPhase('home')} />
          </>
        )}

        {phase === 'home' && (
          <div className={`home-layer ${activeUid ? 'is-behind' : ''}`} aria-hidden={Boolean(activeUid)}>
            <StatusBar onOpenControlCenter={() => setControlCenter(true)} />
            <HomeScreen onOpen={openApp} />
            <HomeBar onHome={goHome} onRecents={() => setRecentsOpen(true)} />
          </div>
        )}

        {phase === 'home' &&
          openApps.map(({ uid, appId }) => (
            <AppWindow
              key={uid}
              app={APP_BY_ID[appId]}
              active={uid === activeUid}
              onHome={goHome}
              onRecents={() => setRecentsOpen(true)}
              onOpenControlCenter={() => setControlCenter(true)}
            />
          ))}

        {controlCenter && <ControlCenter onClose={() => setControlCenter(false)} />}

        {recentsOpen && (
          <Recents
            openApps={openApps.map(({ uid, appId }) => ({ uid, app: APP_BY_ID[appId] }))}
            onActivate={(uid) => {
              setActiveUid(uid);
              setRecentsOpen(false);
            }}
            onCloseApp={(uid) => {
              setOpenApps((prev) => prev.filter((item) => item.uid !== uid));
              setActiveUid((current) => (current === uid ? null : current));
            }}
            onDismiss={() => setRecentsOpen(false)}
          />
        )}

        <div className="dim-overlay" aria-hidden="true" style={{ opacity: dim }} />
      </div>

      <p className="stage-hint">BananaOS · Plantain 1.0</p>
    </div>
  );
}
