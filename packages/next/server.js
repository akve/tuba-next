const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const fs = require('fs');

app.prepare().then(() => {
  const server = express();

  server.get('/', (req, res) => {
    const cacheFile = './cache/root.html';
    console.log('requested /');
    if (fs.existsSync(cacheFile)) {
      const content = fs.readFileSync(cacheFile, 'utf-8');
      res.send(content);
      return;
    }
    const _resEnd = res.end.bind(res);
    res.end = function (payload) {
      if (res.statusCode === 200) {
        fs.writeFileSync(cacheFile, payload, 'utf-8');
      }
      return _resEnd(payload);
    };

    return app.render(req, res, '/', req.query);
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
