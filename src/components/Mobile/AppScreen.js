import React from 'react';

export default function AppScreen({ title, onBack, children }) {
  return (
    <section className="m-app" aria-label={title}>
      <header className="m-app-bar">
        <button className="m-back" onClick={onBack} aria-label="Back to home">‹</button>
        <h1 className="m-app-title">{title}</h1>
      </header>
      <div className="m-app-body">{children}</div>
    </section>
  );
}