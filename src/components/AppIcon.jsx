import { Glyph } from '../os/Glyph'

export function AppIcon({
  app,
  size = 58,
  badge = 0,
  label = false,
  onClick,
  className = '',
  plain = false,
}) {
  const inner = (
    <>
      <span
        className={`app-icon tint-${app.tint}`}
        style={{ width: size, height: size, borderRadius: size * 0.28 }}
      >
        <Glyph name={app.icon} size={size * 0.52} strokeWidth={1.8} />
        {badge > 0 && <span className="app-badge">{badge > 99 ? '99+' : badge}</span>}
      </span>
      {label && <span className="app-icon-label">{app.name}</span>}
    </>
  )

  if (plain) {
    return <span className={`app-icon-wrap ${className}`}>{inner}</span>
  }

  return (
    <button
      type="button"
      className={`app-icon-wrap ${className}`}
      onClick={onClick}
      aria-label={app.name}
    >
      {inner}
    </button>
  )
}

export function BananaMark({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="banana-body" x1="4" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE873" />
          <stop offset="1" stopColor="#E9B81C" />
        </linearGradient>
      </defs>
      <path
        d="M8.4 4.6c-.7 8.3 3.9 13.6 11.9 14.5.9.1 1.2.8.4 1.5-3.4 3-10.9 2.1-14.2-3.7C3.9 12.8 4.2 7.8 6.6 4.8c.5-.6 1.4-.7 1.8-.2Z"
        fill="url(#banana-body)"
      />
      <path d="M8.6 4.3c.2-1.1 1.2-1.6 2-1.1" stroke="#7A5A12" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20.6 19.6c.7.6 1.3.6 2 .2" stroke="#B48A16" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
