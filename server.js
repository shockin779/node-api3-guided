const express = require('express'); // importing a CommonJS module
const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const logger = require('morgan');

const server = express();

// server.use(express.json());
// server.use(helmet());
// server.use(logger('dev'));
// server.use(methodLogger);
const middleware = [express.json(), helmet(), logger('dev'), methodLogger, addName];
server.use(middleware);
server.use('/api/hubs', lockout);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || 'Sean';
  next();
}

function lockout(req, res, next) {
  let seconds = new Date().getSeconds();
  if(seconds % 3 === 0) {
    res.status(403).json({ message: 'api lockout!' });
  } else {
    next();
  }
}

module.exports = server;
