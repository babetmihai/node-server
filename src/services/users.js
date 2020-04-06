const uuidv1 = require('uuid/v1')
const bcrypt = require('bcrypt')

const createUser = async ({ email, password }, conn) => {
  if (!email || !password) throw new Error('invalid.request')
  const existing = await getUserByEmail({ email }, conn)
  if (existing) throw new Error('user.already.exists')
  const id = uuidv1()
  const hash = await bcrypt.hash(password, 10)
  const user = { id, email, hash }

  await conn.query('INSERT INTO users SET ?', user)
  return user
}

const getUserByEmail = async ({ email }, conn) => {
  const [[user]] = await conn.query('SELECT * FROM users WHERE users.email = ?', [email])
  return user
}

module.exports = {
  createUser,
  getUserByEmail
}
