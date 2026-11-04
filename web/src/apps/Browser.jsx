import React, { useEffect, useRef, useState } from 'react';
import { IconButton } from '../os/AppFrame';
import { Icon } from '../os/icons';

const HOME_URL = 'banana://start';

const SHORTCUTS = [
  { label: 'Banana (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Banana', tint: '#F5D142' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com', tint: '#FF8A3D' },
  { label: 'BBC News', url: 'https://www.bbc.co.uk/news', tint: '#E4572E' },
  { label: 'Example.org', url: 'https://example.org', tint: '#5AC8FA' },
];

function Spinner() {
  return (
    <div className="browser-loading">
      <span className="spinner" />
      <p>Loading over BananaNet…</p>
    </div>
  );
}

function BrowserHome({ onOpen }) {
  return (
    <div className="browser-home">
      <div className="browser-hero">
        <span role="img" aria-label="Banana" className="hero-emoji">
          🍌
        </span>
        <h2>Browser</h2>
        <p>Search the web or type an address above.</p>
      </div>
      <div className="shortcut-grid">
        {SHORTCUTS.map((item) => (
          <button type="button" key={item.url} className="shortcut" onClick={() => onOpen(item.url)}>
            <span className="shortcut-dot" style={{ background: item.tint }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <p className="browser-note">Pages are fetched through the BananaOS network service.</p>
    </div>
  );
}

function PageView({ data, onOpen }) {
  return (
    <article className="page-view">
      <div className="page-source">{new URL(data.url).hostname}</div>
      <h2 className="page-title">{data.title}</h2>
      {data.description ? <p className="page-desc">{data.description}</p> : null}
      {data.blocks.map((block, index) => {
        if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
          return (
            <h3 key={index} className={`page-h ${block.type}`}>
              {block.text}
            </h3>
          );
        }
        if (block.type === 'li') {
          return (
            <p key={index} className="page-li">
              <span className="bullet">•</span> {block.text}
            </p>
          );
        }
        if (block.type === 'pre') {
          return (
            <pre key={index} className="page-pre">
              {block.text}
            </pre>
          );
        }
        return (
          <p key={index} className="page-p">
            {block.text}
          </p>
        );
      })}
      {data.links?.length ? (
        <div className="page-links">
          <h4>Links on this page</h4>
          {data.links.slice(0, 16).map((link) => (
            <button type="button" key={link.href} className="page-link" onClick={() => onOpen(link.href)}>
              {link.text}
              <span className="link-host">{safeHost(link.href)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function safeHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function SearchView({ query, results, onOpen }) {
  return (
    <div className="search-view">
      <p className="search-label">Results for “{query}”</p>
      {results.map((result) => (
        <button type="button" key={result.url} className="search-result" onClick={() => onOpen(result.url)}>
          <span className="search-result-host">{safeHost(result.url)}</span>
          <span className="search-result-title">{result.title}</span>
          <span className="search-result-snippet">{result.snippet}</span>
        </button>
      ))}
      {!results.length && <p className="browser-note">Nothing found. Try different words.</p>}
    </div>
  );
}

export default function Browser({ params }) {
  const [nav, setNav] = useState({ stack: [{ kind: 'home', url: HOME_URL }], pos: 0 });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const view = nav.stack[nav.pos];
  const requestId = useRef(0);

  const push = (entry) =>
    setNav((current) => ({ stack: [...current.stack.slice(0, current.pos + 1), entry], pos: current.pos + 1 }));

  const go = async (raw) => {
    const target = String(raw || '').trim();
    if (!target) return;
    if (target === HOME_URL) {
      push({ kind: 'home', url: HOME_URL });
      return;
    }
    const isUrl = /^https?:\/\//i.test(target) || /^[\w-]+(\.[\w-]+)+([/?#]\S*)?$/.test(target);
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    try {
      const endpoint = isUrl
        ? `/api/browse?url=${encodeURIComponent(target)}`
        : `/api/search?q=${encodeURIComponent(target)}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (requestId.current !== id) return;
      if (!data.ok) {
        push({ kind: 'error', url: target, message: data.error || 'That page could not be opened.' });
      } else if (isUrl) {
        push({ kind: 'page', url: data.url || target, data });
      } else {
        push({ kind: 'search', url: `search:${target}`, query: target, results: data.results || [] });
      }
    } catch {
      if (requestId.current === id) {
        push({ kind: 'error', url: target, message: 'BananaNet is unreachable right now.' });
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.url) go(params.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.url]);

  useEffect(() => {
    if (view.kind === 'page') setInput(view.url);
    else if (view.kind === 'search') setInput(view.query);
    else if (view.kind === 'error') setInput(view.url);
    else setInput('');
  }, [view]);

  const back = () => setNav((current) => ({ ...current, pos: Math.max(0, current.pos - 1) }));
  const forward = () => setNav((current) => ({ ...current, pos: Math.min(current.stack.length - 1, current.pos + 1) }));

  const reload = () => {
    if (view.kind === 'page') go(view.url);
    else if (view.kind === 'search') go(view.query);
    else if (view.kind === 'error') go(view.url);
  };

  const submit = (event) => {
    event.preventDefault();
    go(input);
    event.target.querySelector('input')?.blur();
  };

  return (
    <div className="app-frame browser">
      <div className="browser-bar">
        <IconButton name="chevronLeft" label="Back" onClick={back} className={nav.pos === 0 ? 'is-disabled' : ''} />
        <form className="address-bar" onSubmit={submit}>
          <Icon name={view.kind === 'page' ? 'lock' : 'search'} size={13} />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search or enter address"
            aria-label="Address"
            inputMode="search"
            onFocus={(event) => event.target.select()}
          />
        </form>
        <IconButton
          name="chevronRight"
          label="Forward"
          onClick={forward}
          className={nav.pos >= nav.stack.length - 1 ? 'is-disabled' : ''}
        />
        <IconButton name="refresh" label="Reload" onClick={reload} />
      </div>

      <div className="browser-view">
        {loading && <Spinner />}
        {!loading && view.kind === 'home' && <BrowserHome onOpen={go} />}
        {!loading && view.kind === 'page' && <PageView data={view.data} onOpen={go} />}
        {!loading && view.kind === 'search' && <SearchView query={view.query} results={view.results} onOpen={go} />}
        {!loading && view.kind === 'error' && (
          <div className="browser-error">
            <div className="empty-icon">
              <Icon name="wifiOff" size={24} />
            </div>
            <p className="empty-title">Page not available</p>
            <p className="empty-note">{view.message}</p>
            <button type="button" className="pill-button" onClick={() => go(HOME_URL)}>
              Go to start page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
