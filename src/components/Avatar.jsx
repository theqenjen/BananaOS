export function Avatar({ contact, size = 44 }) {
  const initials = contact?.initials || (contact?.name || '?').slice(0, 2).toUpperCase()
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(160deg, ${contact?.color || '#8a8f98'}, ${
          contact?.color ? `${contact.color}99` : '#6b7280'
        })`,
        fontSize: Math.round(size * 0.36),
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
