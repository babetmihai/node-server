const _ = require('lodash')
const authService = require('../services/auth')
const { Router } = require('express')
const { promisePool } =  require('../db')

const router = Router()
router.post('/login', async (req, res, next) => {
  let conn
  try {
    const { email, password } = req.body
    conn = await promisePool.getConnection()
    const token = await authService.createToken({ email, password }, conn)
    res.status(200).json({ token })
  } catch (error) {
    error.status = 401
    next(error)
  } finally {
    if (conn) conn.release()
  }
})

router.use(async (req, res, next) => {
  try {
    const token = _.get(req, 'headers.authorization', '').replace('Bearer ', '')
    const { userId } = await authService.verifyToken({ token })
    req.locals = { ...req.locals, userId }
    next()
  } catch (error) {
    error.status = 401
    next(error)
  }
})

module.exports =  router
