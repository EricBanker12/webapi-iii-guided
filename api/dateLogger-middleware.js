module.exports = dateLogger

function dateLogger(req, res, next) {
  console.log(new Date().toISOString())
  next()
}