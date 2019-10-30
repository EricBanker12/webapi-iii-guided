const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function methodAndPathLogger(req, res, next) {
  console.log(`${req.method} ${req.path}`)
  next()
}

const dateLogger = require('./api/dateLogger-middleware')

function doubler(req, res, next) {
  const num = Number(req.query.num || 0)
  req.doubled = num * 2
  next()
}

// change the gatekeeper to return a 400 if no password is provided and a message
// that says please provide a password
// if a password is provided and it is mellon, call next, otherwise return a 401
// and the you shall not pass message
function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  // new way of reading data sent by the client
  const password = req.headers.password || ''
  if (!password) res.status(400).json({ message: 'please provide a password.' })
  else if (password.toLowerCase() === 'mellon') next()
  else res.status(401).json({ you: 'cannot pass!!' })
}

// global
server.use(helmet()) // third party
server.use(express.json());
server.use(gateKeeper)
server.use(morgan('dev'))
server.use(dateLogger)
server.use(methodAndPathLogger)

server.use('/api/hubs', hubsRouter);

// server.use(doubler)

server.get('/', doubler, (req, res) => {
  res.json({num: req.doubled})
});

module.exports = server;
