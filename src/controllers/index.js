const { Router } = require('express')
const auth = require('./auth')
const users = require('./users')
const products = require('./products')
const errors = require('./errors')

const router = Router()
router.use(auth)
router.use(users)
router.use(products)
router.use(errors)

module.exports = router
