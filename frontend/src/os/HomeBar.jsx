import { useRef } from 'react';

export default function HomeBar({ onHome, onRecents }) {
  const timer = useRef(null);
  const fired = useRef(false);

  const clear = () => clearTimeout(timer.current);

  return (
    <button
      className="home-bar"
      type="button"
      aria-label="Home — hold for recent apps"
      onPointerDown={() => {
        fired.current = false;
        timer.current = setTimeout(() => {
          fired.current = true;
          onRecents?.();
        }, 450);
      }}
      onPointerUp={clear}
      onPointerLeave={clear}
      onPointerCancel={clear}
      onClick={() => {
        if (fired.current) {
          fired.current = false;
          return;
        }
        onHome?.();
      }}
    >
      <span />
    </button>
  );
}
