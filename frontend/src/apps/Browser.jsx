import { useEffect, useRef, useState } from 'react';
import { Lock, RotateCw, ChevronLeft, ChevronRight, Share2, Star, Plus, X } from 'lucide-react';
import SiteRouter, { START_URL, normalizeInput, siteName } from './browser/sites.jsx';

const newTab = () => ({
  id: `tab-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  history: [START_URL],
  index: 0,
});

export default function BrowserApp() {
  const first = useRef(newTab());
  const [tabs, setTabs] = useState([first.current]);
  const [activeId, setActiveId] = useState(first.current.id);
  const [address, setAddress] = useState(START_URL);
  const [editing, setEditing] = useState(false);
  const [tabSheet, setTabSheet] = useState(false);
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const viewport = useRef(null);
  const loadTimer = useRef(null);
  const toastTimer = useRef(null);

  const active = tabs.find((tab) => tab.id === activeId) || tabs[0];
  const url = active.history[active.index];

  useEffect(() => {
    if (!editing) setAddress(url);
  }, [url, editing]);

  useEffect(() => {
    if (viewport.current) viewport.current.scrollTop = 0;
  }, [url, activeId]);

  useEffect(
    () => () => {
      clearTimeout(loadTimer.current);
      clearTimeout(toastTimer.current);
    },
    []
  );

  const flash = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1600);
  };

  const startLoad = () => {
    setLoading(true);
    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoading(false), 520);
  };

  const navigate = (raw) => {
    const next = normalizeInput(raw);
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === active.id ? { ...tab, history: [...tab.history.slice(0, tab.index + 1), next], index: tab.index + 1 } : tab
      )
    );
    setAddress(next);
    setEditing(false);
    setStarred(false);
    startLoad();
  };

  const step = (delta) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== active.id) return tab;
        const nextIndex = tab.index + delta;
        if (nextIndex < 0 || nextIndex >= tab.history.length) return tab;
        return { ...tab, index: nextIndex };
      })
    );
    setEditing(false);
    startLoad();
  };

  const addTab = () => {
    const tab = newTab();
    setTabs((prev) => [...prev, tab]);
    setActiveId(tab.id);
    setTabSheet(false);
    setAddress(START_URL);
    setEditing(false);
  };

  const closeTab = (id) => {
    setTabs((prev) => {
      if (prev.length === 1) return [{ ...prev[0], history: [START_URL], index: 0 }];
      const next = prev.filter((tab) => tab.id !== id);
      if (id === activeId) {
        const fallback = next[next.length - 1];
        setActiveId(fallback.id);
      }
      return next;
    });
  };

  const search = (query) => navigate(`peelsearch.com/search?q=${encodeURIComponent(query)}`);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(url === START_URL ? 'banana://start' : url);
      flash('Link copied');
    } catch {
      flash('Link: ' + url);
    }
  };

  return (
    <div className="browser">
      <div className="browser-chrome">
        <div className="browser-urlbar">
          <span className="url-lock">
            <Lock size={10} strokeWidth={2.6} />
          </span>
          <input
            value={editing ? address : url === START_URL ? 'Start Page' : url}
            onChange={(event) => setAddress(event.target.value)}
            onFocus={(event) => {
              setEditing(true);
              setAddress(url);
              requestAnimationFrame(() => event.target.select());
            }}
            onBlur={() => setEditing(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                navigate(address);
                event.currentTarget.blur();
              }
              if (event.key === 'Escape') {
                setEditing(false);
                event.currentTarget.blur();
              }
            }}
            aria-label="Address bar"
            spellCheck={false}
            autoComplete="off"
          />
          <button className="url-reload" type="button" onClick={() => navigate(url)} aria-label="Reload page">
            <RotateCw size={12} />
          </button>
        </div>
        {loading && <span className="browser-progress" />}
      </div>

      <div className="browser-viewport" ref={viewport}>
        <SiteRouter url={url} goto={navigate} onSearch={search} />
      </div>

      <nav className="browser-toolbar">
        <button type="button" onClick={() => step(-1)} disabled={active.index === 0} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => step(1)} disabled={active.index >= active.history.length - 1} aria-label="Forward">
          <ChevronRight size={20} />
        </button>
        <button type="button" onClick={share} aria-label="Share">
          <Share2 size={18} />
        </button>
        <button
          type="button"
          className={starred ? 'is-on' : ''}
          onClick={() => {
            setStarred((prev) => !prev);
            flash(starred ? 'Bookmark removed' : 'Bookmarked');
          }}
          aria-label="Bookmark"
        >
          <Star size={18} fill={starred ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="tabs-btn" onClick={() => setTabSheet(true)} aria-label="Tabs">
          <span>{tabs.length}</span>
        </button>
      </nav>

      {toast && <div className="browser-toast">{toast}</div>}

      {tabSheet && (
        <div className="sheet-layer">
          <div className="sheet-scrim" onClick={() => setTabSheet(false)} />
          <div className="sheet tabs-sheet">
            <div className="sheet-grabber" />
            <div className="tabs-head">
              <h3>Tabs</h3>
              <button type="button" className="nav-btn" onClick={addTab} aria-label="New tab">
                <Plus size={16} />
              </button>
            </div>
            <div className="tabs-grid">
              {tabs.map((tab) => {
                const tabUrl = tab.history[tab.index];
                return (
                  <div key={tab.id} className={`tab-card ${tab.id === active.id ? 'is-active' : ''}`}>
                    <button
                      type="button"
                      className="tab-card-main"
                      onClick={() => {
                        setActiveId(tab.id);
                        setTabSheet(false);
                      }}
                    >
                      <span className="tab-card-title">{siteName(tabUrl)}</span>
                      <span className="tab-card-url">{tabUrl === START_URL ? 'Start Page' : tabUrl}</span>
                    </button>
                    <button type="button" className="tab-card-close" onClick={() => closeTab(tab.id)} aria-label="Close tab">
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
            <button type="button" className="btn-ghost tabs-new" onClick={addTab}>
              <Plus size={15} /> New tab
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
