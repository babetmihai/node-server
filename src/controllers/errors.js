
module.exports = (error, req, res, next) => {
  const {
    status = 500,
    message = 'internal.error'
  } = error
  res.status(status).json({ message, status })
}