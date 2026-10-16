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
function Gallery({ photos }) {
  const dialogRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

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

  const current = photos[index];

  return (
    <>
      <ul className="gallery-grid">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              className="gallery-thumb"
              onClick={() => open(i)}
              aria-label={`View photo: ${p.alt}`}
            >
              <img src={p.src} alt="" loading="lazy" />
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
            <video
              key={current.src}
              ref={videoRef}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={current.alt}
            >
            {current.captions && (
              <track kind="captions" src={current.captions} srcLang="en" label="English" default />
            )}
            </video>
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