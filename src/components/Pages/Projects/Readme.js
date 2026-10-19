// components/Projects/Readme.js
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getReadme } from '../../../api/github';
import './Readme.css';

function makeUrlTransform(repo) {
  const rawBase = repo.url.replace('https://github.com/', 'https://raw.githubusercontent.com/');
  return (url, key) => {
    if (/^(https?:|mailto:|#)/i.test(url)) return url;
    const path = url.replace(/^\.?\//, '');
    return key === 'src'
      ? `${rawBase}/${repo.branch}/${path}`
      : `${repo.url}/blob/${repo.branch}/${path}`;
  };
}

const components = {
  a: ({ node, children, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer">{children}</a>
  ),
  img: ({ node, ...props }) => <img {...props} alt={props.alt || ''} loading="lazy" />,
};

export default function Readme({ repo }) {
  const [state, setState] = useState({ status: 'loading', markdown: null });

  useEffect(() => {
    const controller = new AbortController();
    getReadme(repo.name, controller.signal)
      .then((d) => setState({ status: d.markdown ? 'done' : 'empty', markdown: d.markdown }))
      .catch((e) => {
        if (e.name !== 'AbortError') setState({ status: 'error', markdown: null });
      });
    return () => controller.abort();
  }, [repo.name]);

  // With no button to explain a failure, a missing README just doesn't appear
  if (state.status === 'empty' || state.status === 'error') return null;

  return (
    <div className="readme">
      <div className="readme-body">
        {state.status === 'loading' ? (
          <p className="readme-note">Loading README…</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            urlTransform={makeUrlTransform(repo)}
            components={components}
          >
            {state.markdown}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}