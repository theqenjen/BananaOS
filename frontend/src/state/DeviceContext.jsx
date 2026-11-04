import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';

const DEFAULTS = {
  theme: 'dark',
  wallpaper: 'dusk',
  wifi: true,
  bluetooth: true,
  airplane: false,
  dnd: false,
  brightness: 88,
  deviceName: 'Banana Phone',
};

const DeviceContext = createContext(null);

export function DeviceProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [battery, setBattery] = useState(76);
  const [charging, setCharging] = useState(false);
  const saveTimer = useRef(null);
  const pending = useRef({});

  useEffect(() => {
    let alive = true;
    api
      .settings()
      .then((remote) => {
        if (!alive) return;
        setSettings((prev) => ({ ...prev, ...remote }));
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBattery((b) => {
        if (charging) return Math.min(100, b + 1);
        return b > 4 ? b - 1 : b;
      });
    }, 45000);
    return () => clearInterval(timer);
  }, [charging]);

  const patch = useCallback((partial) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    pending.current = { ...pending.current, ...partial };
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const payload = pending.current;
      pending.current = {};
      api.saveSettings(payload).catch(() => {});
    }, 400);
  }, []);

  const value = useMemo(
    () => ({ settings, loaded, battery, charging, toggleCharging: () => setCharging((c) => !c), patch }),
    [settings, loaded, battery, charging, patch]
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevice must be used inside DeviceProvider');
  return ctx;
}

export const WALLPAPERS = {
  dusk: 'radial-gradient(90% 60% at 15% 6%, rgba(255,211,78,.34), transparent 62%), radial-gradient(85% 60% at 92% 18%, rgba(255,116,80,.3), transparent 58%), linear-gradient(165deg,#120E1F 0%,#1D1630 42%,#3B2413 100%)',
  citrus: 'radial-gradient(70% 50% at 25% 10%, rgba(255,255,255,.5), transparent 60%), linear-gradient(165deg,#FFE79A 0%,#FFB347 48%,#F26B38 100%)',
  aurora: 'radial-gradient(70% 55% at 18% 18%, rgba(18,225,196,.5), transparent 62%), radial-gradient(70% 55% at 84% 26%, rgba(108,99,255,.55), transparent 60%), linear-gradient(165deg,#050914,#0B1B2B 60%,#05070E)',
  midnight: 'radial-gradient(70% 45% at 72% 12%, rgba(79,140,247,.4), transparent 60%), linear-gradient(170deg,#04060D,#0A1224 58%,#05070E)',
  peach: 'radial-gradient(70% 50% at 20% 8%, rgba(255,255,255,.35), transparent 60%), linear-gradient(165deg,#FFD9BE,#FFAAA5 55%,#B5838D)',
  mono: 'radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,.08), transparent 65%), linear-gradient(170deg,#1B1B1E,#0A0A0B)',
};
