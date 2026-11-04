import React, { useState } from 'react';
import { AppFrame, EmptyState } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { useOS } from '../os/store';
import { shortStamp } from '../os/hooks';

export default function Photos() {
  const { photos, removePhoto, openApp } = useOS();
  const [viewing, setViewing] = useState(null);

  return (
    <AppFrame
      title="Photos"
      subtitle={`${photos.length} items`}
      right={
        <button type="button" className="icon-button" onClick={() => openApp('camera')} aria-label="Open camera">
          <Icon name="camera" size={20} />
        </button>
      }
      bodyClassName="photos-body"
    >
      {!photos.length && <EmptyState title="No photos yet" note="Take a picture in Camera." icon="photos" />}
      <div className="photo-grid">
        {photos.map((photo) => (
          <button type="button" key={photo.id} className="photo-tile" onClick={() => setViewing(photo)}>
            {photo.type === 'photo' ? (
              <img src={photo.src} alt="Photo" />
            ) : (
              <span className="photo-sample" style={{ background: photo.css }} />
            )}
          </button>
        ))}
      </div>

      {viewing && (
        <div className="photo-viewer" onClick={() => setViewing(null)}>
          <div className="photo-viewer-stage" onClick={(event) => event.stopPropagation()}>
            {viewing.type === 'photo' ? (
              <img src={viewing.src} alt="Photo" />
            ) : (
              <span className="photo-sample large" style={{ background: viewing.css }} />
            )}
            <div className="photo-viewer-meta">
              <span>{viewing.label || shortStamp(viewing.ts || Date.now())}</span>
              <div className="photo-viewer-actions">
                {viewing.type === 'photo' && (
                  <button
                    type="button"
                    className="pill-button ghost small"
                    onClick={() => {
                      removePhoto(viewing.id);
                      setViewing(null);
                    }}
                  >
                    Delete
                  </button>
                )}
                <button type="button" className="pill-button small" onClick={() => setViewing(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppFrame>
  );
}
