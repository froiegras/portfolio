// components/Photos/Photos.js
import React, { useState, useEffect } from 'react';
import Gallery from '../../components/Shared/Gallery/Gallery';
import { photoSections } from '../../data/photoSections';
import './Photos.css';

// 'mt-example-2025' -> 'Mt Example 2025'
const pretty = (slug) => slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function Cover({ src, fallback }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <span aria-hidden="true">{fallback}</span>;
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

export default function Photos() {
  const [albums, setAlbums] = useState(null);      // null while loading
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadSection = async (section) => {
      if (section.folder) {
        return [{
          key: section.folder,
          section: section.id,
          title: section.title,
          folder: section.folder,
          icon: section.icon,
        }];
      }
      try {
        const res = await fetch(`/media/${section.root}/`, { signal: controller.signal });
        if (!res.ok) return [];
        const list = await res.json();
        return list
          .filter((f) => f.type === 'directory')
          .map((f) => ({
            key: `${section.root}/${f.name}`,
            section: section.id,
            title: pretty(f.name),
            folder: `${section.root}/${f.name}`,
            cover: `/media/${section.root}/${f.name}/cover.webp`,
            icon: section.icon,
          }));
      } catch {
        return [];
      }
    };

    Promise.all(photoSections.map(loadSection)).then((all) => {
      if (!controller.signal.aborted) setAlbums(all.flat());
    });
    return () => controller.abort();
  }, []);

  if (open) {
    return (
      <div className="photos">
        <button className="photos-back" onClick={() => setOpen(null)}>← All albums</button>
        <h2 className="photos-title">{open.title}</h2>
        <Gallery folder={open.folder} />
      </div>
    );
  }

  if (albums === null) return <p className="photos-note">Loading albums…</p>;
  if (albums.length === 0) return <p className="photos-note">No albums yet.</p>;

  return (
    <div className="photos">
      {photoSections.map((section) => {
        const items = albums.filter((a) => a.section === section.id);
        if (items.length === 0) return null;
        return (
          <section key={section.id}>
            <h2 className="photos-section">{section.title}</h2>
            <ul className="photos-grid">
              {items.map((a) => (
                <li key={a.key}>
                  <button className="photos-tile" onClick={() => setOpen(a)}>
                    <span className="photos-cover">
                      <Cover src={a.cover} fallback={a.icon} />
                    </span>
                    <span className="photos-name">{a.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}