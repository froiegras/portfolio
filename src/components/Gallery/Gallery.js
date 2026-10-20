// components/Gallery/Gallery.js
import React, { useRef, useState, useEffect } from 'react';
import './Gallery.css';

const isVideo = (p) => p.type === 'video';

// Note for file formats for Gallery:
// Images:
// - Resize and compress: about 1600px on the long edge, saved as WebP, usually 150-300 KB each.
// squoosh.app does this in the browser. Phone photos are often 3-5 MB and would make the page slow.
// - Strip location data: hiking photos often carry GPS coordinates in their metadata.
// Squoosh removes it when it re-encodes, but check that yours has no location left before publishing.

// Videos:
// - Use MP4 with H.264 video and AAC audio. It plays in every browser.
// iPhone .mov files are often HEVC (H.265), which Chrome and Firefox may refuse to play, so convert them.
// - Compress before uploading. Phone videos can be hundreds of MB.
// This ffmpeg command gives roughly 3-8 MB per 30 seconds at 720p, strips metadata (including GPS), and lets playback start before the whole file downloads
function Gallery({ folder }) {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const base = `/media/${folder}/`;

    fetch(base)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (cancelled) return;
        const items = list
          .filter((f) => f.type === 'file')
          .map((f) => f.name)
          .filter((n) => !/-poster\./i.test(n) && /\.(webp|jpe?g|png|avif|mp4|webm)$/i.test(n))
          .sort()
          .map((n) => {
            const video = /\.(mp4|webm)$/i.test(n);
            const stem = n.replace(/\.[^.]+$/, '');
            const text =
              stem.replace(/^\d{4}-\d{2}-\d{2}-?/, '').replace(/[-_]/g, ' ') || stem;
            return {
              src: base + n,
              type: video ? 'video' : 'image',
              poster: video ? `${base}${stem}-poster.webp` : undefined,
              alt: text,
              caption: text,
            };
          });
        setPhotos(items);
      })
      .catch(() => { if (!cancelled) setPhotos([]); });

    return () => { cancelled = true; };
  }, [folder]);

  const open = (i) => {
    setIndex(i);
    setIsOpen(true);
    dialogRef.current.showModal();
  };
  const close = () => dialogRef.current.close();
  const step = (d) => setIndex((i) => (i + d + photos.length) % photos.length);

  // arrow keys while the lightbox is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.target.tagName === 'VIDEO') return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, photos.length]);

  if (photos.length === 0) return null;
  const current = photos[index];

  return (
    <>
      <ul className="gallery-grid">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              className="gallery-thumb"
              onClick={() => open(i)}
              aria-label={`${isVideo(p) ? 'Play video' : 'View photo'}: ${p.alt}`}
            >
              <img src={isVideo(p) ? p.poster : p.src} alt="" loading="lazy" />
              {isVideo(p) && <span className="gallery-play" aria-hidden="true">▶</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        onClose={() => { videoRef.current?.pause(); setIsOpen(false); }}
      >
        <button className="gallery-close" onClick={close} aria-label="Close">✕</button>

        <figure className="gallery-figure">
          {isVideo(current) ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              key={current.src}
              ref={videoRef}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={current.alt}
            />
          ) : (
            <img src={current.src} alt={current.alt} />
          )}
          <figcaption>
            {current.caption}
            <span className="gallery-count">{index + 1} / {photos.length}</span>
          </figcaption>
        </figure>

        {photos.length > 1 && (
          <div className="gallery-nav">
            <button onClick={() => step(-1)} aria-label="Previous photo">‹</button>
            <button onClick={() => step(1)} aria-label="Next photo">›</button>
          </div>
        )}
      </dialog>
    </>
  );
}

export default Gallery;