import { useMemo, useState } from 'react';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Share2,
  Play,
  ShoppingBag,
  Newspaper,
  Users,
  Clapperboard,
  BookOpen,
  ShieldAlert,
  ChevronLeft,
} from 'lucide-react';
import { NEWS, SOCIAL_POSTS, VIDEOS, PRODUCTS, WIKI, SEARCH_SUGGESTIONS, searchSites } from './data.js';

export const SITE_HOSTS = [
  { host: 'peelsearch.com', name: 'Peel Search' },
  { host: 'banana.news', name: 'The Banana Times' },
  { host: 'bananabook.com', name: 'Bananabook' },
  { host: 'bananatube.com', name: 'BananaTube' },
  { host: 'bananastore.com', name: 'Banana Store' },
  { host: 'wiki.banana', name: 'WikiBanana' },
];

const ALIASES = {
  'google.com': 'peelsearch.com',
  'www.google.com': 'peelsearch.com',
  'bing.com': 'peelsearch.com',
  'duckduckgo.com': 'peelsearch.com',
  'bbc.co.uk': 'banana.news',
  'bbc.com': 'banana.news',
  'theguardian.com': 'banana.news',
  'facebook.com': 'bananabook.com',
  'instagram.com': 'bananabook.com',
  'x.com': 'bananabook.com',
  'twitter.com': 'bananabook.com',
  'youtube.com': 'bananatube.com',
  'netflix.com': 'bananatube.com',
  'amazon.com': 'bananastore.com',
  'amazon.co.uk': 'bananastore.com',
  'apple.com': 'bananastore.com',
  'wikipedia.org': 'wiki.banana',
  'en.wikipedia.org': 'wiki.banana',
};

export const START_URL = 'banana://start';

export function normalizeInput(raw) {
  const value = String(raw || '').trim();
  if (!value) return START_URL;
  if (value.startsWith('banana://')) return START_URL;
  if (/\s/.test(value) || !value.includes('.')) {
    return `peelsearch.com/search?q=${encodeURIComponent(value)}`;
  }
  const cleaned = value.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  const slash = cleaned.indexOf('/');
  const host = (slash === -1 ? cleaned : cleaned.slice(0, slash)).toLowerCase();
  const rest = slash === -1 ? '' : cleaned.slice(slash);
  const mapped = ALIASES[host] || host;
  const known = SITE_HOSTS.some((site) => site.host === mapped);
  return `${known ? mapped : host}${rest}`;
}

export function siteName(url) {
  if (!url || url === START_URL) return 'Start Page';
  const host = url.split('/')[0].split('?')[0];
  const known = SITE_HOSTS.find((site) => site.host === host);
  if (known) return known.name;
  return host;
}

function Link({ children, to, goto, className = '' }) {
  return (
    <button type="button" className={className} onClick={() => goto(to)}>
      {children}
    </button>
  );
}

/* --------------------------------- start --------------------------------- */
function StartPage({ goto, onSearch }) {
  const [value, setValue] = useState('');
  const links = [
    { label: 'News', host: 'banana.news', icon: Newspaper, tint: '#c0392b' },
    { label: 'Social', host: 'bananabook.com', icon: Users, tint: '#2563eb' },
    { label: 'Video', host: 'bananatube.com', icon: Clapperboard, tint: '#dc2626' },
    { label: 'Shop', host: 'bananastore.com', icon: ShoppingBag, tint: '#059669' },
    { label: 'Wiki', host: 'wiki.banana', icon: BookOpen, tint: '#6b7280' },
  ];

  return (
    <div className="site site-start">
      <div className="start-inner">
        <div className="start-logo">
          <span className="start-mark">🍌</span>
          <span className="start-word">Peel</span>
        </div>
        <p className="start-tagline">The BananaNet, indexed.</p>

        <form
          className="start-search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(value);
          }}
        >
          <Search size={16} />
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search BananaNet or type a site name"
            aria-label="Search BananaNet"
          />
          <button type="submit" aria-label="Search">
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="start-links">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button key={link.host} type="button" className="start-link" onClick={() => goto(link.host)}>
                <span className="start-link-icon" style={{ background: link.tint }}>
                  <Icon size={17} />
                </span>
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="start-favourites">
          <span className="start-fav-label">Favourites</span>
          {NEWS.slice(0, 3).map((story) => (
            <button key={story.slug} type="button" className="start-fav" onClick={() => goto(`banana.news/story/${story.slug}`)}>
              <span className="start-fav-dot" />
              <span className="start-fav-text">{story.title}</span>
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>

        <p className="start-foot">BananaNet · 6 sites · served from your pocket</p>
      </div>
    </div>
  );
}

/* --------------------------------- search -------------------------------- */
function SearchPage({ query, goto, onSearch }) {
  const [value, setValue] = useState(query);
  const results = useMemo(() => searchSites(query), [query]);

  return (
    <div className="site site-search">
      <header className="peel-head">
        <button type="button" className="peel-logo" onClick={() => goto(START_URL)}>
          Peel
        </button>
        <form
          className="peel-search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(value);
          }}
        >
          <input value={value} onChange={(event) => setValue(event.target.value)} aria-label="Search" />
          <button type="submit" aria-label="Search">
            <Search size={15} />
          </button>
        </form>
      </header>

      <div className="peel-body">
        {query && (
          <p className="peel-count">
            {results.length} result{results.length === 1 ? '' : 's'} for “{query}” · 0.08 seconds
          </p>
        )}
        {!query && (
          <div className="peel-empty">
            <h2>Search the BananaNet</h2>
            <p>Six sites, about eighty pages, one very good fruit. Try:</p>
            <div className="peel-chips">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => onSearch(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {results.map((result) => (
          <article key={result.url} className="result">
            <div className="result-domain">
              <span className="result-favicon" />
              {result.domain}
            </div>
            <button className="result-title" type="button" onClick={() => goto(result.url)}>
              {result.title}
            </button>
            <p className="result-snippet">{result.snippet}</p>
          </article>
        ))}

        {query && results.length === 0 && (
          <div className="peel-empty">
            <h2>No pages found for “{query}”</h2>
            <p>BananaNet is small. Try one of these instead.</p>
            <div className="peel-chips">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => onSearch(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="peel-foot">Peel Search · a friendly index of the BananaNet</p>
      </div>
    </div>
  );
}

/* ---------------------------------- news --------------------------------- */
function NewsPage({ goto }) {
  const [lead, ...rest] = NEWS;
  return (
    <div className="site site-news">
      <header className="news-masthead">
        <div className="news-top">
          <span>Wednesday, 4 November</span>
          <span className="news-edition">London edition</span>
        </div>
        <button className="news-logo" type="button" onClick={() => goto('banana.news')}>
          The Banana Times
        </button>
        <nav className="news-nav">
          <span>World</span>
          <span>Climate</span>
          <span>Food</span>
          <span>Transport</span>
          <span>Tech</span>
        </nav>
      </header>

      <div className="news-body">
        <button type="button" className="news-lead" onClick={() => goto(`banana.news/story/${lead.slug}`)}>
          <div className="news-art" style={{ background: lead.art }} />
          <span className="news-kicker">{lead.kicker}</span>
          <h1>{lead.title}</h1>
          <p>{lead.standfirst}</p>
          <span className="news-meta">
            {lead.author} · {lead.read}
          </span>
        </button>

        <div className="news-list">
          {rest.map((story) => (
            <button key={story.slug} type="button" className="news-item" onClick={() => goto(`banana.news/story/${story.slug}`)}>
              <div className="news-item-text">
                <span className="news-kicker">{story.kicker}</span>
                <h2>{story.title}</h2>
                <span className="news-meta">
                  {story.date} · {story.read}
                </span>
              </div>
              <div className="news-thumb" style={{ background: story.art }} />
            </button>
          ))}
        </div>

        <div className="news-ticker">
          <strong>Live</strong> Rooftop orchard harvest passes 900 planters · Night bus library seeks a third shelf · Banana bread sales up 12%
        </div>
      </div>
    </div>
  );
}

function StoryPage({ slug, goto }) {
  const story = NEWS.find((item) => item.slug === slug) || NEWS[0];
  return (
    <div className="site site-news">
      <header className="story-head">
        <button type="button" className="story-back" onClick={() => goto('banana.news')}>
          <ChevronLeft size={15} /> The Banana Times
        </button>
      </header>
      <article className="story-body">
        <span className="news-kicker">{story.kicker}</span>
        <h1 className="story-title">{story.title}</h1>
        <p className="story-standfirst">{story.standfirst}</p>
        <div className="story-meta">
          <span>By {story.author}</span>
          <span>
            {story.date} · {story.read}
          </span>
        </div>
        <div className="story-art" style={{ background: story.art }} />
        {story.body.map((paragraph, index) => (
          <p key={index} className={index === 0 ? 'story-lede' : ''}>
            {paragraph}
          </p>
        ))}
        <div className="story-share">
          <span>Share</span>
          <button type="button">
            <Share2 size={15} />
          </button>
          <button type="button">
            <Heart size={15} />
          </button>
        </div>
      </article>
    </div>
  );
}

/* --------------------------------- social -------------------------------- */
function SocialPage() {
  const [liked, setLiked] = useState({});
  return (
    <div className="site site-social">
      <header className="social-head">
        <span className="social-logo">bananabook</span>
        <div className="social-actions">
          <span className="social-dot" />
          <span className="social-dot is-alt" />
          <span className="social-dot is-alt" />
        </div>
      </header>
      <div className="social-tabs">
        <span className="is-on">Feed</span>
        <span>Friends</span>
        <span>Groups</span>
        <span>Saved</span>
      </div>
      <div className="social-body">
        {SOCIAL_POSTS.map((post) => (
          <article key={post.handle} className="post">
            <header>
              <span className="post-avatar" style={{ background: post.color }}>
                {post.name[0]}
              </span>
              <div>
                <strong>{post.name}</strong>
                <span>
                  {post.handle} · {post.time}
                </span>
              </div>
              <button type="button" className="post-more" aria-label="More">
                ···
              </button>
            </header>
            <p>{post.body}</p>
            {post.art && <div className="post-art" style={{ background: post.art }} />}
            <footer>
              <button
                type="button"
                className={liked[post.handle] ? 'is-liked' : ''}
                onClick={() => setLiked((prev) => ({ ...prev, [post.handle]: !prev[post.handle] }))}
              >
                <Heart size={14} fill={liked[post.handle] ? 'currentColor' : 'none'} /> {post.likes + (liked[post.handle] ? 1 : 0)}
              </button>
              <button type="button">
                <MessageCircle size={14} /> {post.comments}
              </button>
              <button type="button">
                <Share2 size={14} /> Share
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- video --------------------------------- */
function TubePage() {
  return (
    <div className="site site-tube">
      <header className="tube-head">
        <span className="tube-logo">
          Banana<span>Tube</span>
        </span>
        <div className="tube-search">
          <Search size={13} />
          <span>Search</span>
        </div>
      </header>
      <div className="tube-body">
        <div className="tube-feature">
          <div className="tube-thumb is-large" style={{ background: VIDEOS[0].art }}>
            <span className="tube-play">
              <Play size={20} fill="currentColor" />
            </span>
            <span className="tube-length">{VIDEOS[0].length}</span>
          </div>
          <h1>{VIDEOS[0].title}</h1>
          <p>
            {VIDEOS[0].channel} · {VIDEOS[0].views} · {VIDEOS[0].age}
          </p>
          <div className="tube-actions">
            <span>1.2M likes</span>
            <span>Subscribe</span>
          </div>
        </div>

        <h2 className="tube-section">Recommended</h2>
        <div className="tube-grid">
          {VIDEOS.slice(1).map((video) => (
            <article key={video.title} className="tube-card">
              <div className="tube-thumb" style={{ background: video.art }}>
                <span className="tube-length">{video.length}</span>
              </div>
              <h3>{video.title}</h3>
              <p>{video.channel}</p>
              <p>
                {video.views} · {video.age}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- shop --------------------------------- */
function StorePage() {
  const [bag, setBag] = useState(0);
  const [added, setAdded] = useState(null);

  return (
    <div className="site site-store">
      <header className="store-head">
        <span className="store-logo">BANANA</span>
        <span className="store-bag">
          <ShoppingBag size={15} />
          {bag > 0 && <em>{bag}</em>}
        </span>
      </header>
      <div className="store-body">
        <div className="store-hero">
          <div className="store-hero-copy">
            <span className="store-eyebrow">New</span>
            <h1>Banana Phone 15</h1>
            <p>Titanium peel. All-day battery. From £899.</p>
            <button type="button" onClick={() => setBag((b) => b + 1)}>
              Buy
            </button>
          </div>
          <div className="store-hero-art" />
        </div>

        <h2 className="store-section">Featured</h2>
        <div className="store-grid">
          {PRODUCTS.map((product) => (
            <article key={product.name} className="product">
              <div className="product-art" style={{ background: product.art }}>
                <span>{product.tag}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.blurb}</p>
              <div className="product-foot">
                <strong>{product.price}</strong>
                <button
                  type="button"
                  onClick={() => {
                    setBag((b) => b + 1);
                    setAdded(product.name);
                    setTimeout(() => setAdded(null), 1400);
                  }}
                >
                  {added === product.name ? 'Added' : 'Add'}
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className="store-foot">Free delivery over £30 · 30-day returns · Prices include VAT</p>
      </div>
    </div>
  );
}

/* ---------------------------------- wiki --------------------------------- */
function WikiPage({ goto, onSearch }) {
  const [value, setValue] = useState('');
  return (
    <div className="site site-wiki">
      <header className="wiki-head">
        <button type="button" className="wiki-logo" onClick={() => goto('wiki.banana')}>
          <span>W</span> WikiBanana
        </button>
        <form
          className="wiki-search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(value);
          }}
        >
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Search WikiBanana" aria-label="Search WikiBanana" />
          <Search size={14} />
        </form>
      </header>
      <article className="wiki-body">
        <h1>
          {WIKI.title}
          <span>{WIKI.subtitle}</span>
        </h1>
        <div className="wiki-tabs">
          <span className="is-on">Article</span>
          <span>Talk</span>
          <span>Read</span>
          <span>Edit</span>
        </div>
        <p className="wiki-lede">
          A <strong>banana</strong> is an elongated, edible fruit produced by several kinds of large herbaceous flowering plants in the genus{' '}
          <em>Musa</em>. It is the most traded fruit in the world and, since 2024, an operating system.
        </p>
        <table className="wiki-facts">
          <tbody>
            {WIKI.facts.map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {WIKI.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <p className="wiki-ref">Last edited 2 days ago · 14 editors · CC BY-SA 4.0</p>
      </article>
    </div>
  );
}

/* -------------------------------- not found ------------------------------- */
function ErrorPage({ url, goto }) {
  const host = url.split('/')[0];
  return (
    <div className="site site-error">
      <div className="error-inner">
        <ShieldAlert size={30} />
        <h1>BananaNet can’t open the page</h1>
        <p className="error-url">{host}</p>
        <p>
          The server stopped responding, or the address isn’t part of BananaNet. This browser only reaches the six sites in the
          Peel index.
        </p>
        <div className="error-actions">
          <Link to={START_URL} goto={goto} className="error-btn is-primary">
            Go to start page
          </Link>
          <button type="button" className="error-btn" onClick={() => goto('peelsearch.com')}>
            Search instead
          </button>
        </div>
        <p className="error-code">ERR_BANANA_NAME_NOT_RESOLVED</p>
      </div>
    </div>
  );
}

/* -------------------------------- dispatcher ------------------------------- */
export default function SiteRouter({ url, goto, onSearch }) {
  const [path, queryString] = url.split('?');
  const [host, ...segments] = path.split('/');
  const query = new URLSearchParams(queryString || '').get('q') || '';

  const title = useMemo(() => {
    if (host === 'banana.news' && segments[0] === 'story') {
      const story = NEWS.find((item) => item.slug === segments[1]);
      return story ? story.title : 'The Banana Times';
    }
    return siteName(url);
  }, [url, host, segments]);

  let node;
  if (url === START_URL) node = <StartPage goto={goto} onSearch={onSearch} />;
  else if (host === 'peelsearch.com' && segments[0] === 'search') node = <SearchPage query={query} goto={goto} onSearch={onSearch} />;
  else if (host === 'peelsearch.com') node = <SearchPage query="" goto={goto} onSearch={onSearch} />;
  else if (host === 'banana.news' && segments[0] === 'story') node = <StoryPage slug={segments[1]} goto={goto} />;
  else if (host === 'banana.news') node = <NewsPage goto={goto} />;
  else if (host === 'bananabook.com') node = <SocialPage />;
  else if (host === 'bananatube.com') node = <TubePage />;
  else if (host === 'bananastore.com') node = <StorePage />;
  else if (host === 'wiki.banana') node = <WikiPage goto={goto} onSearch={onSearch} />;
  else node = <ErrorPage url={url} goto={goto} />;

  return (
    <div className="browser-page" key={url}>
      {node}
      <span className="site-title" hidden>
        {title}
      </span>
    </div>
  );
}
