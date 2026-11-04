import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../os/icons';
import { IconButton } from '../os/AppFrame';
import { useOS } from '../os/store';

export default function Camera() {
  const { addPhoto, photos, openApp } = useOS();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('starting');
  const [facing, setFacing] = useState('environment');
  const [error, setError] = useState('');
  const [shot, setShot] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setStatus('starting');
      setError('');
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera access was blocked. Allow it in your browser to take photos.'
            : 'No camera was found on this device.',
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [facing]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    const scale = Math.min(1, 1080 / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const src = canvas.toDataURL('image/jpeg', 0.78);
    addPhoto(src);
    setShot(src);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  };

  const last = photos[0];

  return (
    <div className="camera-app">
      <div className="camera-top">
        <span className="camera-chip">
          <Icon name="camera" size={14} /> Banana Camera
        </span>
        <IconButton name="photos" label="Open Photos" onClick={() => openApp('photos')} />
      </div>

      <div className="camera-stage">
        <video ref={videoRef} className="camera-video" playsInline muted autoPlay />
        {status !== 'ready' && (
          <div className="camera-fallback">
            {status === 'starting' ? (
              <>
                <span className="spinner" />
                <p>Starting camera…</p>
              </>
            ) : (
              <>
                <div className="empty-icon">
                  <Icon name="camera" size={24} />
                </div>
                <p className="empty-title">Camera unavailable</p>
                <p className="empty-note">{error}</p>
                <button type="button" className="pill-button" onClick={() => setFacing((value) => (value === 'environment' ? 'user' : 'environment'))}>
                  Try the other lens
                </button>
              </>
            )}
          </div>
        )}
        {flash && <div className="camera-flash" />}
      </div>

      <div className="camera-controls">
        <button type="button" className="camera-thumb" onClick={() => openApp('photos')} aria-label="Open gallery">
          {last?.type === 'photo' ? (
            <img src={last.src} alt="Last photo" />
          ) : (
            <span style={{ background: last?.css || 'linear-gradient(160deg,#FFD76E,#FF7A45)' }} />
          )}
        </button>
        <button
          type="button"
          className="shutter"
          aria-label="Take photo"
          disabled={status !== 'ready'}
          onClick={capture}
        >
          <span />
        </button>
        <button type="button" className="camera-flip" onClick={() => setFacing((value) => (value === 'environment' ? 'user' : 'environment'))} aria-label="Flip camera">
          <Icon name="refresh" size={22} />
        </button>
      </div>

      {shot && (
        <div className="shot-preview">
          <img src={shot} alt="Captured" />
          <div className="shot-actions">
            <button type="button" className="pill-button ghost" onClick={() => setShot(null)}>
              Retake
            </button>
            <button
              type="button"
              className="pill-button"
              onClick={() => {
                setShot(null);
                openApp('photos');
              }}
            >
              View in Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
