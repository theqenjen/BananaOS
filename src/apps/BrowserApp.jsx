import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'
import { Glyph } from '../os/Glyph'
import { BananaMark } from '../components/AppIcon'
import { BOOKMARKS, HELPER_ARTICLES, SEARCH_RESULTS } from './banananet'

function HomePage({ navigate, onHelp }) {
  const [query, setQuery] = useState('')
  return (
    <div className="page page-home">
      <div className="brand">
        <BananaMark size={52} />
        <h1>Banana Search</h1>
        <p>The freshest index on the peel</p>
      </div>
      <form
        className="search-bar"
        onSubmit={(event) => {
          event.preventDefault()
          if (query.trim()) navigate(query)
        }}
      >
        <Glyph name="search" size={17} strokeWidth={2} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the web"
          aria-label="Search the web"
          enterKeyHint="search"
        />
        <button type="submit" className="search-go" aria-label="Search">
          <Glyph name="arrowRight" size={17} strokeWidth={2.1} />
        </button>
      </form>
      <div className="tiles">
        {BOOKMARKS.map((mark) => (
          <button type="button" key={mark.label} className="tile" onClick={() => navigate(mark.url)}>
            <span>{mark.emoji}</span>
            {mark.label}
          </button>
        ))}
      </div>
      <div className="page-links">
        <button type="button" onClick={onHelp}>
          How to use BananaOS
        </button>
        <button type="button" onClick={() => navigate('banana://about')}>
          About this browser
        </button>
      </div>
    </div>
  )
}

function SearchPage({ query, navigate, onHelp }) {
  return (
    <div className="page">
      <h2 className="page-title">Results for “{query}”</h2>
      <p className="page-sub">Live pages are fetched and rendered by BananaOS.</p>
      <div className="results">
        {SEARCH_RESULTS.map((result) => (
          <button
            type="button"
            key={result.url}
            className="result"
            onClick={() => navigate(result.url)}
          >
            <span className="result-url">{new URL(result.url).hostname}</span>
            <strong>{result.title}</strong>
            <span className="result-snippet">{result.snippet}</span>
          </button>
        ))}
      </div>
      <div className="page-links">
        <button type="button" onClick={onHelp}>
          BananaOS help
        </button>
      </div>
    </div>
  )
}

function ArticlePage({ slug, navigate }) {
  const article = HELPER_ARTICLES[slug]
  if (!article) return null
  return (
    <div className="page">
      <h2 className="page-title">{article.title}</h2>
      <p className="page-sub">{article.intro}</p>
      <div className="article">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      <div className="page-links">
        <button type="button" onClick={() => navigate('banana://home')}>
          Back to start page
        </button>
      </div>
    </div>
  )
}

export function BrowserApp() {
  const { actions } = useOS()
  const [history, setHistory] = useState([{ kind: 'home' }])
  const [position, setPosition] = useState(0)
  const [address, setAddress] = useState('')
  const [page, setPage] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const inputRef = useRef(null)

  const current = history[position]

  useEffect(() => {
    if (current.kind === 'web') {
      setAddress(current.url)
      return
    }
    if (current.kind === 'search') {
      setAddress(`Search: ${current.query}`)
      return
    }
    setAddress('banana://home')
  }, [current])

  useEffect(() => {
    if (current.kind !== 'web') {
      setPage(null)
      setStatus('idle')
      return
    }
    let cancelled = false
    setStatus('loading')
    setPage(null)
    setError('')

    fetch(`/api/browse?url=${encodeURIComponent(current.url)}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return
        if (result.ok) {
          setPage(result)
          setStatus('idle')
        } else {
          setError(result.error || 'That page would not load')
          setStatus('error')
        }
      })
      .catch(() => {
        if (cancelled) return
        setError('BananaOS could not reach that site')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [current, reloadKey])

  const push = (entry) => {
    setHistory((entries) => [...entries.slice(0, position + 1), entry])
    setPosition((value) => value + 1)
  }

  const navigate = (raw) => {
    const input = (raw || '').trim()
    if (!input) return

    if (input.startsWith('banana://')) {
      const slug = input.replace('banana://', '').replace(/\/$/, '') || 'home'
      if (slug === 'help' || slug === 'about') push({ kind: slug })
      else push({ kind: 'home' })
      return
    }
    const looksLikeHost = /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(input)
    const isUrl = /^https?:\/\//i.test(input)
    if (isUrl || looksLikeHost) {
      push({ kind: 'web', url: isUrl ? input : `https://${input}` })
      return
    }
    push({ kind: 'search', query: input })
  }

  const goBack = () => setPosition((value) => Math.max(0, value - 1))
  const goForward = () => setPosition((value) => Math.min(history.length - 1, value + 1))
  const goHome = () => push({ kind: 'home' })

  return (
    <section className="app-layer browser-app">
      <header className="browser-head">
        <div className="browser-bar">
          <button
            type="button"
            className="browser-lock"
            aria-label="Home page"
            onClick={goHome}
          >
            <Glyph name="globe" size={15} strokeWidth={2} />
          </button>
          <form
            className="address"
            onSubmit={(event) => {
              event.preventDefault()
              inputRef.current?.blur()
              navigate(address)
            }}
          >
            <input
              ref={inputRef}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onFocus={(event) => event.target.select()}
              placeholder="Search or enter address"
              aria-label="Address"
              enterKeyHint="go"
              spellCheck="false"
              autoComplete="off"
            />
          </form>
          <button
            type="button"
            className="browser-reload"
            aria-label="Reload page"
            onClick={() => {
              if (current.kind === 'web') setReloadKey((key) => key + 1)
              else setAddress((value) => value)
            }}
          >
            <Glyph name="refresh" size={15} strokeWidth={2.1} />
          </button>
        </div>
        {status === 'loading' && <div className="load-bar" />}
      </header>

      <div className="browser-view">
        {current.kind === 'home' && (
          <HomePage navigate={navigate} onHelp={() => navigate('banana://help')} />
        )}
        {current.kind === 'search' && (
          <SearchPage
            query={current.query}
            navigate={navigate}
            onHelp={() => navigate('banana://help')}
          />
        )}
        {(current.kind === 'help' || current.kind === 'about') && (
          <ArticlePage slug={current.kind} navigate={navigate} />
        )}

        {current.kind === 'web' && status === 'loading' && (
          <div className="browser-state">
            <div className="spinner" />
            <p>Loading {new URL(current.url).hostname}…</p>
          </div>
        )}

        {current.kind === 'web' && status === 'error' && (
          <div className="browser-state">
            <div className="state-icon">
              <Glyph name="globe" size={26} strokeWidth={1.8} />
            </div>
            <h2>Page not available</h2>
            <p>{error}</p>
            <p className="state-url">{current.url}</p>
            <div className="state-actions">
              <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </button>
              <button type="button" onClick={goHome}>
                Start page
              </button>
            </div>
          </div>
        )}

        {current.kind === 'web' && status === 'idle' && page && (
          <iframe
            key={`${page.url}-${reloadKey}`}
            className="web-frame"
            title={page.title}
            srcDoc={page.html}
            sandbox=""
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      <nav className="browser-tools" aria-label="Browser controls">
        <button type="button" onClick={goBack} disabled={position === 0} aria-label="Back">
          <Glyph name="back" size={19} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={position >= history.length - 1}
          aria-label="Forward"
        >
          <Glyph name="chevronRight" size={19} strokeWidth={2} />
        </button>
        <button type="button" onClick={goHome} aria-label="Start page">
          <Glyph name="search" size={19} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => actions.notify({ appId: 'browser', title: 'Bookmarked', body: current.kind === 'web' ? current.url : 'BananaOS start page' })}
          aria-label="Add bookmark"
        >
          <Glyph name="bookmark" size={19} strokeWidth={2} />
        </button>
      </nav>
    </section>
  )
}
