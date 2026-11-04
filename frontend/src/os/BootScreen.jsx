import { useEffect, useState } from 'react';
import { Banana } from 'lucide-react';

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(100, 6 + (elapsed / 1900) * 94));
    }, 60);
    const done = setTimeout(onDone, 2050);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className="boot">
      <div className="boot-mark">
        <Banana size={54} strokeWidth={1.6} />
      </div>
      <div className="boot-word">BananaOS</div>
      <div className="boot-version">Plantain 1.0</div>
      <div className="boot-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
