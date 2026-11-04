import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from 'lucide-react';

const TRACKS = [
  { title: 'Ripe', artist: 'Peel Sessions', album: 'Plantain', length: 214, art: 'linear-gradient(150deg,#FFE07A,#F2B705 55%,#B45309)' },
  { title: 'Night Bus', artist: 'Nolan & The Frames', album: 'After Midnight', length: 245, art: 'linear-gradient(150deg,#1E3C72,#2A5298 55%,#F7B733)' },
  { title: 'Slow Market', artist: 'Osei', album: 'Sunday', length: 187, art: 'linear-gradient(150deg,#F7971E,#FFD200 65%,#FFEFBA)' },
  { title: 'Aurora, Pt. 2', artist: 'Yara', album: 'Northern', length: 302, art: 'linear-gradient(150deg,#0F2027,#2C5364 55%,#4CA1AF)' },
];

const fmt = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export default function MusicApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liked, setLiked] = useState(false);

  const track = TRACKS[index];

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setElapsed((value) => {
        if (value + 1 >= track.length) {
          setIndex((current) => (current + 1) % TRACKS.length);
          return 0;
        }
        return value + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, track.length]);

  const select = (next) => {
    setIndex(next);
    setElapsed(0);
  };

  return (
    <div className="music">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Music</h1>
          <p className="app-head-sub">Playing from your library</p>
        </div>
        <Volume2 size={18} style={{ opacity: 0.5 }} />
      </header>

      <div className="music-body">
        <div className={`music-art ${playing ? 'is-playing' : ''}`} style={{ background: track.art }}>
          <span className="music-art-gloss" />
          {playing && (
            <div className="music-bars" aria-hidden="true">
              {Array.from({ length: 11 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="music-meta">
          <div>
            <h2>{track.title}</h2>
            <p>
              {track.artist} · {track.album}
            </p>
          </div>
          <button type="button" className={liked ? 'is-liked' : ''} onClick={() => setLiked((v) => !v)} aria-label="Like">
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="music-progress">
          <div className="music-track-line">
            <span style={{ width: `${(elapsed / track.length) * 100}%` }} />
          </div>
          <div className="music-times">
            <span>{fmt(elapsed)}</span>
            <span>-{fmt(track.length - elapsed)}</span>
          </div>
        </div>

        <div className="music-controls">
          <button type="button" className="music-small" aria-label="Shuffle">
            <Shuffle size={18} />
          </button>
          <button type="button" onClick={() => select((index - 1 + TRACKS.length) % TRACKS.length)} aria-label="Previous track">
            <SkipBack size={26} fill="currentColor" />
          </button>
          <button type="button" className="music-play" onClick={() => setPlaying((value) => !value)} aria-label="Play or pause">
            {playing ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
          </button>
          <button type="button" onClick={() => select((index + 1) % TRACKS.length)} aria-label="Next track">
            <SkipForward size={26} fill="currentColor" />
          </button>
          <button type="button" className="music-small" aria-label="Repeat">
            <Repeat size={18} />
          </button>
        </div>

        <div className="music-queue">
          <span className="section-label" style={{ padding: '0 0 8px 2px' }}>
            Up next
          </span>
          {TRACKS.map((item, i) => (
            <button key={item.title} type="button" className={`queue-row ${i === index ? 'is-on' : ''}`} onClick={() => select(i)}>
              <span className="queue-art" style={{ background: item.art }} />
              <span className="queue-text">
                <strong>{item.title}</strong>
                <em>{item.artist}</em>
              </span>
              <span className="queue-length">{fmt(item.length)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
