import { useState } from 'react'
import { AppShell } from '../components/AppShell'
import { Glyph } from '../os/Glyph'
import { PHOTOS } from '../os/seed'

function PhotoArt({ photo, large = false }) {
  return (
    <span
      className={`photo-art ${large ? 'is-large' : ''}`}
      style={{ background: `linear-gradient(155deg, ${photo.a}, ${photo.b})` }}
      aria-hidden="true"
    >
      <span className="photo-glow" />
      <span className="photo-horizon" />
    </span>
  )
}

export function PhotosApp() {
  const [open, setOpen] = useState(null)

  return (
    <AppShell
      className="photos-app"
      title="Photos"
      subtitle={`${PHOTOS.length} photos · this device`}
      actions={
        <button type="button" className="head-btn" aria-label="Photo options">
          <Glyph name="keypadGrid" size={18} strokeWidth={2} />
        </button>
      }
    >
      <div className="photo-grid">
        {PHOTOS.map((photo) => (
          <button
            type="button"
            key={photo.id}
            className="photo-tile"
            onClick={() => setOpen(photo)}
            aria-label={photo.label}
          >
            <PhotoArt photo={photo} />
          </button>
        ))}
      </div>

      {open && (
        <div className="photo-viewer" role="dialog" aria-label={open.label}>
          <div className="photo-viewer-art">
            <PhotoArt photo={open} large />
          </div>
          <div className="photo-viewer-bar">
            <div>
              <strong>{open.label}</strong>
              <span>Today · London</span>
            </div>
            <button type="button" className="photo-close" onClick={() => setOpen(null)} aria-label="Close photo">
              <Glyph name="x" size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
