import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { ExtractQueryParams } from './utils/extract-query-params.js';



const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res)

  const route = routes.find(route => {
    return route.path.test(url) && route.method === method
  })

  if (route) {
    const routeParams = req.url.match(route.path)


    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? ExtractQueryParams(query) : {}
    return route.handler(req, res)
  }

  return res.writeHead(404).end();
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});