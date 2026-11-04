const GLYPHS = {
  phone: (
    <>
      <path d="M6.6 3.2H4.4A1.4 1.4 0 0 0 3 4.6C3 13.7 10.3 21 19.4 21a1.4 1.4 0 0 0 1.4-1.4v-2.2l-4.3-1.7-2 2.1a15.2 15.2 0 0 1-6.3-6.3l2.1-2L6.6 3.2Z" />
    </>
  ),
  messages: (
    <>
      <path d="M12 4.2c4.6 0 8.3 3 8.3 6.8s-3.7 6.8-8.3 6.8c-1 0-2-.1-2.9-.4L5.2 19l1.2-3.2c-1.7-1.3-2.7-3-2.7-4.8 0-3.8 3.7-6.8 8.3-6.8Z" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.4 2.3 3.6 5.2 3.6 8.4S14.4 18.1 12 20.4c-2.4-2.3-3.6-5.2-3.6-8.4S9.6 5.9 12 3.6Z" />
    </>
  ),
  photos: (
    <>
      <rect x="3.6" y="4.6" width="16.8" height="14.8" rx="3.2" />
      <circle cx="9.1" cy="9.7" r="1.5" />
      <path d="M4.4 16.8 9 12.6a1.9 1.9 0 0 1 2.6 0l4.2 4.2M14.6 15l1.8-1.7a1.9 1.9 0 0 1 2.6 0l1.3 1.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.1 1.9" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3.4" width="14" height="17.2" rx="3.2" />
      <path d="M8.4 7.9h7.2" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.9h.01M12 15.9h.01M15.5 15.9h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="3.2" />
      <path d="M3.6 10h16.8M8.3 3.4v3.4M15.7 3.4v3.4" />
    </>
  ),
  weather: (
    <>
      <circle cx="9.2" cy="8.8" r="3" />
      <path d="M9.2 2.9v1.4M4.9 8.8H3.5M14.9 8.8h-1.4M5.9 5.5 4.9 4.5M12.5 5.5l-1 1" />
      <path d="M8.6 20h8.1a3.1 3.1 0 0 0 .3-6.2 4.4 4.4 0 0 0-8.3 1" />
    </>
  ),
  notes: (
    <>
      <path d="M6.2 3.6h8.3l3.3 3.3v13.5H6.2z" />
      <path d="M14.5 3.6v3.3h3.3M9 12.2h6M9 15.7h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.9v2.4M12 18.7v2.4M2.9 12h2.4M18.7 12h2.4M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </>
  ),
  music: (
    <>
      <path d="M9.2 17.6V6.4l8-1.7v11.1" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="15" cy="16.2" r="2.2" />
    </>
  ),
  back: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  chevronRight: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  chevronDown: <path d="M5.5 9.5 12 16l6.5-6.5" />,
  lock: (
    <>
      <rect x="5" y="10.4" width="14" height="9.6" rx="2.6" />
      <path d="M8.2 10.4V8a3.8 3.8 0 0 1 7.6 0v2.4" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10.4" width="14" height="9.6" rx="2.6" />
      <path d="M8.2 10.4V8a3.8 3.8 0 0 1 7.2-1.5" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="M15.5 15.5 20 20" />
    </>
  ),
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  trash: (
    <>
      <path d="M4.8 7.2h14.4M9.2 7.2V5.4h5.6v1.8M6.6 7.2l.9 12.2h9l.9-12.2" />
      <path d="M10.4 10.6v5.6M13.6 10.6v5.6" />
    </>
  ),
  send: <path d="M4.5 12 20 4.5 15.5 20 12 13.5 4.5 12Z" />,
  mic: (
    <>
      <rect x="9.2" y="3.4" width="5.6" height="10" rx="2.8" />
      <path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0M12 17.6v3" />
    </>
  ),
  speaker: (
    <>
      <path d="M4.5 9.2h3.2L12 5.4v13.2L7.7 14.8H4.5z" />
      <path d="M15.6 9a4.2 4.2 0 0 1 0 6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
    </>
  ),
  mute: (
    <>
      <path d="M4.5 9.2h3.2L12 5.4v13.2L7.7 14.8H4.5z" />
      <path d="M16 9.4l5 5M21 9.4l-5 5" />
    </>
  ),
  keypadGrid: (
    <>
      <path d="M7 6.5h.01M12 6.5h.01M17 6.5h.01M7 12h.01M12 12h.01M17 12h.01M7 17.5h.01M12 17.5h.01M17 17.5h.01" />
    </>
  ),
  addPerson: (
    <>
      <circle cx="10" cy="8.4" r="3.2" />
      <path d="M4.4 20c.5-3.1 2.8-5.1 5.6-5.1s5.1 2 5.6 5.1M18 8.6v5.2M20.6 11.2h-5.2" />
    </>
  ),
  check: <path d="M5 12.6l4.4 4.4L19 7.4" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.4 2.3 3.6 5.2 3.6 8.4S14.4 18.1 12 20.4c-2.4-2.3-3.6-5.2-3.6-8.4S9.6 5.9 12 3.6Z" />
    </>
  ),
  battery: (
    <>
      <rect x="2.6" y="7.6" width="16.2" height="8.8" rx="2.6" />
      <path d="M21.2 10.6v2.8" />
    </>
  ),
  wifi: <path d="M4.2 9.4a11.4 11.4 0 0 1 15.6 0M7.1 12.6a7.4 7.4 0 0 1 9.8 0M10 15.8a3.4 3.4 0 0 1 4 0M12 19h.01" />,
  signal: <path d="M4 18v-3M9.3 18v-6M14.7 18V8M20 18V4.5" />,
  bookmark: <path d="M6.5 4.2h11v15.6L12 15.4l-5.5 4.4z" />,
  refresh: (
    <>
      <path d="M19.4 12a7.4 7.4 0 1 1-2.2-5.2" />
      <path d="M19.8 4.6v4.2h-4.2" />
    </>
  ),
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  play: <path d="M7 4.8 19 12 7 19.2z" />,
  pause: <path d="M8.5 4.8v14.4M15.5 4.8v14.4" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </>
  ),
  moon: <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z" />,
}

export function Glyph({ name, size = 24, strokeWidth = 1.7, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {GLYPHS[name] || GLYPHS.globe}
    </svg>
  )
}
