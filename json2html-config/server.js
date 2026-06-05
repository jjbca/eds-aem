#!/usr/bin/env node
// Local proxy server for the json2html-config admin page.
// Serves the HTML at / and forwards /config/* to the Cloudflare Worker.
// Because both the page and the API live on the same origin (localhost),
// the browser never sends a CORS preflight — no worker changes needed.
//
// Usage: node server.js
//        node server.js 8080   (custom port)

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || process.env.PORT || 3000, 10);
const WORKER_HOST = 'json2html.adobeaem.workers.dev';

http.createServer((req, res) => {
  // ── Serve the admin page ──────────────────────────────────────────────────
  if (req.url === '/' || req.url === '/json2html-config.html') {
    const file = path.join(__dirname, 'json2html-config.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(500); res.end('Cannot read json2html-config.html'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // ── Proxy /config/* to the Cloudflare Worker ─────────────────────────────
  if (req.url.startsWith('/config/')) {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = chunks.length ? Buffer.concat(chunks) : null;

      const forwardHeaders = { ...req.headers, host: WORKER_HOST };
      // Strip hop-by-hop headers that must not be forwarded.
      ['connection', 'keep-alive', 'transfer-encoding', 'te',
        'trailer', 'upgrade', 'proxy-authorization', 'proxy-authenticate']
        .forEach((h) => delete forwardHeaders[h]);

      const options = {
        hostname: WORKER_HOST,
        path: req.url,
        method: req.method,
        headers: forwardHeaders,
      };

      const proxy = https.request(options, (workerRes) => {
        res.writeHead(workerRes.statusCode, workerRes.headers);
        workerRes.pipe(res);
      });

      proxy.on('error', (err) => {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Proxy error: ${err.message}` }));
        }
      });

      if (body) proxy.write(body);
      proxy.end();
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}).listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${PORT}/`);
});
