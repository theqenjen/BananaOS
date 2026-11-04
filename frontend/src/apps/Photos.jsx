import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Share2, Heart } from 'lucide-react';
import { api } from '../lib/api';

const FILTERS = ['Library', 'Recents', 'Favourites', 'Places'];

export default function PhotosApp() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('Library');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    api.photos().then(setPhotos).catch(() => {});
  }, []);

  const open = openIndex === null ? null : photos[openIndex];

  return (
    <div className="photos">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Photos</h1>
          <p className="app-head-sub">{photos.length} items · On this device</p>
        </div>
      </header>

      <div className="chips">
        {FILTERS.map((item) => (
          <button key={item} type="button" className={filter === item ? 'is-on' : ''} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="photo-tile"
            style={{ background: photo.gradient }}
            onClick={() => setOpenIndex(index)}
            aria-label={photo.title}
          >
            <span className="photo-tile-date">
              {new Date(photo.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </button>
        ))}
        {photos.length === 0 && <p className="empty-state">No photos yet. Take a picture to fill this grid.</p>}
      </div>

      {open && (
        <div className="photo-viewer">
          <div className="photo-viewer-art" style={{ background: open.gradient }} />
          <div className="photo-viewer-top">
            <button type="button" className="photo-close" onClick={() => setOpenIndex(null)} aria-label="Close">
              <X size={17} />
            </button>
            <span>
              {openIndex + 1} of {photos.length}
            </span>
          </div>

          <button
            type="button"
            className="photo-nav is-left"
            onClick={() => setOpenIndex((index) => (index - 1 + photos.length) % photos.length)}
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="photo-nav is-right"
            onClick={() => setOpenIndex((index) => (index + 1) % photos.length)}
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>

          <div className="photo-viewer-bar">
            <div>
              <strong>{open.title}</strong>
              <span>
                {open.location} ·{' '}
                {new Date(open.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="photo-viewer-actions">
              <button type="button" aria-label="Favourite">
                <Heart size={16} />
              </button>
              <button type="button" aria-label="Share">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
