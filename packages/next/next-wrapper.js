const fs = require('fs');

const nextHandlerWrapper = (app) => {
  const handler = app.getRequestHandler();
  return async ({ raw, url, query }, h) => {
    url.query = query;
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

const pathWrapper = (app, pathName, opts) => async ({ raw, query, params }, h) => {
  const cacheFile = './cache/root.html';
  console.log('requested /');
  if (fs.existsSync(cacheFile)) {
    const content = fs.readFileSync(cacheFile);
    return h.response(content).code(200);
  }

  const html = await app.render(raw.req, raw.res, pathName, { ...query, ...params }, opts);
  console.log('rendered');
  fs.writeFileSync(cacheFile, html, 'utf-8');

  return h.response(html).code(raw.res.statusCode);
};

module.exports = {
  pathWrapper,
  nextHandlerWrapper,
};
