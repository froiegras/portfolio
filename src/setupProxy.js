// src/setupProxy.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const ROOT = path.resolve(__dirname, '..', 'dev-media');

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/api',
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    })
  );

  app.use('/media', (req, res, next) => {
    if (!req.path.endsWith('/')) return next();

    const dir = path.resolve(ROOT, '.' + decodeURIComponent(req.path));
    if (dir !== ROOT && !dir.startsWith(ROOT + path.sep)) {
      return res.sendStatus(403);                       // block ../ tricks
    }

    fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
      if (err) return res.sendStatus(404);
      res.json(
        entries.map((e) => ({
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
        }))
      );
    });
  });

  app.use('/media', express.static(ROOT));
};