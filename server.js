const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

app.disable('x-powered-by');

// Mirror security and cache headers from vercel.json
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=()'
  );
  next();
});

const permanentRedirects = {
  '/products/bubble-gun': '/bubble-gun',
  '/products/bubble-gun.html': '/bubble-gun',
  '/products/stunt-pet': '/stunt-pet',
  '/products/stunt-pet.html': '/stunt-pet',
  '/products/cute-dinos': '/cute-dinos',
  '/products/cute-dinos.html': '/cute-dinos',
  '/products/mini-cool-car': '/mini-cool-car',
  '/products/mini-cool-car.html': '/mini-cool-car',
  '/products/gel-storm': '/gel-storm',
  '/products/gel-storm.html': '/gel-storm',
  '/products/pixel-splash': '/pixel-splash',
  '/products/pixel-splash.html': '/pixel-splash',
  '/products/mecha-rover': '/mecha-rover',
  '/products/mecha-rover.html': '/mecha-rover',
  '/products/magnetic-blocks': '/magnetic-blocks',
  '/products/magnetic-blocks.html': '/magnetic-blocks',
  '/magnetic-block': '/magnetic-blocks',
  '/products/magnetic-block': '/magnetic-blocks',
  '/products/magnetic-block.html': '/magnetic-blocks',
  '/products/rise-one-x-4x4': '/rise-one-x-4x4',
  '/products/rise-one-x-4x4.html': '/rise-one-x-4x4',
  '/rise-one-x': '/rise-one-x-4x4',
  '/products/rise-one-x': '/rise-one-x-4x4',
  '/products/drift-king': '/drift-king',
  '/products/drift-king.html': '/drift-king',
};

const temporaryRedirects = new Set([
  '/barsaat',
  '/products/barsaat',
  '/agni',
  '/products/agni',
  '/noor',
  '/products/noor',
  '/aarav',
  '/products/aarav',
  '/pins-and-art-print',
  '/products/pins-and-art-print',
  '/action-keychains',
  '/products/action-keychains',
  '/character-mug',
  '/products/character-mug',
  '/iphone-15-case',
  '/products/iphone-15-case',
]);

app.use((req, res, next) => {
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  if (Object.prototype.hasOwnProperty.call(permanentRedirects, req.path)) {
    return res.redirect(301, permanentRedirects[req.path] + query);
  }
  if (temporaryRedirects.has(req.path)) {
    return res.redirect(302, '/');
  }
  next();
});

const rewrites = {
  '/': 'index.html',
  '/bubble-gun': 'products/bubble-gun.html',
  '/stunt-pet': 'products/stunt-pet.html',
  '/cute-dinos': 'products/cute-dinos.html',
  '/mini-cool-car': 'products/mini-cool-car.html',
  '/gel-storm': 'products/gel-storm.html',
  '/pixel-splash': 'products/pixel-splash.html',
  '/mecha-rover': 'products/mecha-rover.html',
  '/magnetic-blocks': 'products/magnetic-blocks.html',
  '/rise-one-x-4x4': 'products/rise-one-x-4x4.html',
  '/drift-king': 'products/drift-king.html',
  '/account': 'account.html',
  '/my-account': 'account.html',
  '/dashboard': 'dashboard.html',
  '/dashboard/': 'dashboard.html',
  '/help': 'help.html',
  '/privacy': 'privacy.html',
  '/privacy-policy': 'privacy.html',
  '/terms': 'terms.html',
  '/terms-and-conditions': 'terms.html',
  '/stories': 'stories/index.html',
  '/stories/': 'stories/index.html',
};

Object.entries(rewrites).forEach(([routePath, filePath]) => {
  app.get(routePath, (req, res) => {
    res.sendFile(path.join(ROOT, filePath));
  });
});

app.get('/firebase-client.js', (req, res) => {
  const bundlePath = path.join(ROOT, 'firebase-client.js');
  if (!fs.existsSync(bundlePath)) {
    return res
      .status(404)
      .type('application/javascript')
      .send('// firebase-client.js has not been built yet; run npm run build.\n');
  }
  res.sendFile(bundlePath);
});

app.use(
  '/assets',
  express.static(path.join(ROOT, 'assets'), {
    maxAge: '7d',
  })
);

app.use(
  express.static(ROOT, {
    extensions: ['html'],
    dotfiles: 'ignore',
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`REDPOLY server listening on http://${HOST}:${PORT}`);
});
