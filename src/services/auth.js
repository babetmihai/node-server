const { PRIVATE_KEY } = process.env
const userService = require('./users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const verifyToken = async ({ token }) => {
  if (!token) throw new Error('missing.token')
  const { userId } = await jwt.verify(token, PRIVATE_KEY)
  if (!userId) throw new Error('invalid.token')
  return { userId }
}

const createToken = async ({ email, password }, conn) => {
  if (!email || !password) throw new Error('missing.email.or.passowrd')
  const user = await userService.getUserByEmail({ email }, conn)
  const authenticated = await bcrypt.compare(password, user.hash)
  if (!authenticated) throw new Error('invalid.credentials')
  return jwt.sign({ userId: user.id, email: user.email }, PRIVATE_KEY)
}

module.exports = {
  verifyToken,
  createToken
}
