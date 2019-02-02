const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('local-dev-server/db.json');
const middlewares = jsonServer.defaults();
const nocache = require('nocache');
 
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(nocache());

 
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});
 

server.use('/api/v1/', router);

server.use( (req,res,next) => {
    console.log('checking statuscode');
    if(res.statusCode == 304){
        res.statusCode = 200;
    }
    next();
})

server.listen(3000, () => {
  console.log('JSON Server is running on 3000');
});