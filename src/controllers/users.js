const userService = require('../services/users')
const { Router } = require('express')
const { promisePool } =  require('../db')

const router = Router()
router.post('/users', async (req, res, next) => {
  let conn
  try {
    const { email, password } = req.body
    conn = await promisePool.getConnection()
    const user = await userService.createUser({ email, password }, conn)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  } finally {
    if (conn) conn.release()
  }
})

module.exports = router

