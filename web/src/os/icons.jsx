import React from 'react';

const paths = {
  phone: (
    <path d="M4.6 4.4c0-.9.7-1.6 1.6-1.6h2.1c.8 0 1.4.5 1.6 1.2l.7 3c.1.6-.1 1.2-.6 1.5L8.6 9.7a12.2 12.2 0 0 0 5.7 5.7l1.2-1.4c.3-.5.9-.7 1.5-.6l3 .7c.7.2 1.2.8 1.2 1.6v2.1c0 .9-.7 1.6-1.6 1.6C11 19.4 4.6 13 4.6 4.4Z" />
  ),
  messages: (
    <path d="M20.5 11.6a8.3 8.3 0 0 1-8.9 8.3 9.8 9.8 0 0 1-3.1-.6L3.5 21l1.7-4.7a8.3 8.3 0 0 1 6.4-12.2 8.3 8.3 0 0 1 8.9 7.5Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4c2.4 2.3 3.7 5.4 3.7 8.6s-1.3 6.3-3.7 8.6c-2.4-2.3-3.7-5.4-3.7-8.6S9.6 5.7 12 3.4Z" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.6A2.6 2.6 0 0 1 6.6 6h1.1c.5 0 1-.3 1.2-.7l.6-1c.2-.4.7-.7 1.2-.7h2.6c.5 0 1 .3 1.2.7l.6 1c.2.4.7.7 1.2.7h1.1A2.6 2.6 0 0 1 20 8.6v7.8A2.6 2.6 0 0 1 17.4 19H6.6A2.6 2.6 0 0 1 4 16.4V8.6Z" />
      <circle cx="12" cy="12.5" r="3.3" />
    </>
  ),
  photos: (
    <>
      <rect x="3.6" y="4.4" width="16.8" height="15.2" rx="2.6" />
      <path d="M3.8 16.2 8.6 11.4l3.8 3.8 2.8-2.8 4.9 4.9" />
      <circle cx="8.7" cy="8.8" r="1.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
  calculator: (
    <>
      <rect x="4.6" y="3.2" width="14.8" height="17.6" rx="3" />
      <path d="M8 7.6h8M8.2 12h1.6M14.2 12h1.6M8.2 16h1.6M14.2 16h1.6M12 12v0M12 16v0" />
    </>
  ),
  notes: (
    <>
      <rect x="4.4" y="3.6" width="15.2" height="16.8" rx="2.6" />
      <path d="M8 9h8M8 13h8M8 17h4.5" />
    </>
  ),
  terminal: (
    <>
      <rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2.8" />
      <path d="M7.4 9.4 10.4 12l-3 2.6M12.6 15h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 14.6a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9Z" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.6 8.2a14 14 0 0 1 18.8 0M5.8 11.7a9.4 9.4 0 0 1 12.4 0M9 15.2a5 5 0 0 1 6 0" />
      <circle cx="12" cy="18.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  signal: (
    <>
      <rect x="2.5" y="14" width="3" height="5" rx="1" fill="currentColor" stroke="none" />
      <rect x="7.5" y="11" width="3" height="8" rx="1" fill="currentColor" stroke="none" />
      <rect x="12.5" y="8" width="3" height="11" rx="1" fill="currentColor" stroke="none" />
      <rect x="17.5" y="5" width="3" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="4.8" y="10.4" width="14.4" height="10" rx="2.8" />
      <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" />
    </>
  ),
  unlock: (
    <>
      <rect x="4.8" y="10.4" width="14.4" height="10" rx="2.8" />
      <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.3-1.2" />
    </>
  ),
  chevronUp: <path d="M6 14.5 12 8.5l6 6" />,
  chevronDown: <path d="M6 9.5 12 15.5l6-6" />,
  chevronLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  chevronRight: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.6 15.6 4 4" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  send: <path d="M4.4 12 20 4.4l-4.6 15.2-3.6-6.1-7.4-1.5Z" />,
  mic: (
    <>
      <rect x="9.2" y="3.4" width="5.6" height="10.4" rx="2.8" />
      <path d="M5.8 11.6a6.2 6.2 0 0 0 12.4 0M12 18v2.6" />
    </>
  ),
  video: (
    <>
      <rect x="3.2" y="6.4" width="12.4" height="11.2" rx="2.6" />
      <path d="m15.6 12 5.2-3.4v6.8L15.6 12Z" />
    </>
  ),
  speaker: (
    <>
      <path d="M4.4 9.6h3.2L12 5.8v12.4l-4.4-3.8H4.4V9.6Z" />
      <path d="M15.6 9a4.2 4.2 0 0 1 0 6M18.2 6.4a7.8 7.8 0 0 1 0 11.2" />
    </>
  ),
  mute: (
    <>
      <path d="M4.4 9.6h3.2L12 5.8v12.4l-4.4-3.8H4.4V9.6Z" />
      <path d="m16 9.8 4.4 4.4M20.4 9.8 16 14.2" />
    </>
  ),
  keypad: (
    <>
      {[6, 12, 18].map((cy) =>
        [6, 12, 18].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="currentColor" stroke="none" />),
      )}
    </>
  ),
  trash: (
    <>
      <path d="M4.8 7h14.4M9.4 7V4.8h5.2V7M6.4 7l.9 12.2A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.8L17.6 7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.4 4.6v4.8h-4.8" />
    </>
  ),
  star: <path d="m12 4 2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 17.4 6.7 20.1l1.1-5.8L3.5 10.2l5.9-.8L12 4Z" />,
  play: <path d="M8.2 5.6 18.4 12 8.2 18.4V5.6Z" />,
  pause: (
    <>
      <rect x="7.2" y="5.6" width="3.4" height="12.8" rx="1.4" fill="currentColor" stroke="none" />
      <rect x="13.4" y="5.6" width="3.4" height="12.8" rx="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  backspace: <path d="M9 5.8h9.4A2.6 2.6 0 0 1 21 8.4v7.2a2.6 2.6 0 0 1-2.6 2.6H9l-5.2-6 5.2-6.4ZM12 9.4l4.6 5.2M16.6 9.4 12 14.6" />,
  bluetooth: <path d="M8.6 7.4 15.4 16.6 12 19.6V4.4l3.4 3-6.8 9.2" />,
  flashlight: (
    <>
      <path d="M8 3.6h8v3.2l-1.8 2.6v9.8a2.2 2.2 0 0 1-4.4 0V9.4L8 6.8V3.6Z" />
      <path d="M8 6.2h8" />
    </>
  ),
  moon: <path d="M20.2 14.4A8.4 8.4 0 0 1 9.6 3.8 8.4 8.4 0 1 0 20.2 14.4Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </>
  ),
  airplane: <path d="M12 3.2c.8 0 1.4.6 1.4 1.4v4.7l7.4 4.3v2.2l-7.4-2.2v3.9l2.4 1.8v1.3L12 19.8l-3.8.8v-1.3l2.4-1.8v-3.9l-7.4 2.2v-2.2l7.4-4.3V4.6c0-.8.6-1.4 1.4-1.4Z" />,
  x: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  check: <path d="m5 12.6 4.6 4.6L19 6.8" />,
  arrowUp: <path d="M12 20V4.6M5.8 10.8 12 4.6l6.2 6.2" />,
  wifiOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M5.8 11.7a9.4 9.4 0 0 1 4-2.2M2.6 8.2A14 14 0 0 1 8 5.6M15.9 9.9c1.7.5 3.2 1.4 4.5 2.6M9 15.2a5 5 0 0 1 4.6-.7" />
      <circle cx="12" cy="18.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, size = 22, className = '', strokeWidth = 1.7 }) {
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
      {paths[name] || paths.globe}
    </svg>
  );
}

export function BatteryIcon({ level = 0.82, charging = false }) {
  return (
    <svg viewBox="0 0 30 14" width="26" height="13" aria-hidden="true">
      <rect x="1" y="1.4" width="23" height="11.2" rx="3.4" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.3" />
      <rect x="2.9" y="3.3" width={Math.max(2, 19.2 * level)} height="7.4" rx="2" fill="currentColor" />
      <path d="M25.8 5.2v3.6c1-.2 1.6-.9 1.6-1.8s-.6-1.6-1.6-1.8Z" fill="currentColor" fillOpacity="0.5" />
      {charging && <path d="M12 3.2 8.4 8.4h3L10.8 12l4.2-5.6h-3.2L12 3.2Z" fill="#1b1b1b" />}
    </svg>
  );
}
