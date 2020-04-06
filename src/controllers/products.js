
const productService = require('../services/products')
const { Router } = require('express')
const { pool, promisePool } =  require('../db')

const router = Router()
router.post('/products', async (req, res, next) => {
  let conn
  try {
    const { name } = req.body
    conn = await promisePool.getConnection()
    const product = await productService.createProduct({ name }, conn)
    res.status(200).json(product)
  } catch (error) {
    next(error)
  } finally {
    if (conn) conn.release()
  }
})

router.get('/products', async (req, res, next) => {
  let { search = '', pageSize = 100, pageNo = 0 } = req.query
  pageSize = Number(pageSize)
  pageNo = Number(pageNo)

  if (pageSize > 50) {
    pool.getConnection((error, streamableConn) => {
      if (error) {
        next(error)
      } else {
        let notFirst
        let hasError
        res.write('[')
        productService.streamProducts({ search, pageSize, pageNo }, streamableConn)
          .on('result', (row) => {
            if (notFirst) {
              res.write(',')
            } else {
              notFirst = true
            }
            res.write(JSON.stringify(row))
          })
          .on('end', () => {
            streamableConn.release()
            if (!hasError) {
              res.write(']')
              res.end()
            }
          })
          .on('error', () => {
            hasError = true
            next(error)
          })
      }
    })
  } else {
    let conn
    try {
      conn = await promisePool.getConnection()
      const products = await productService.getProducts({ search, pageSize, pageNo }, conn)
      res.status(200).json(products)
    } catch (error) {
      next(error)
    } finally {
      if (conn) conn.release()
    }
  }
})

router.get('/products/:id', async (req, res, next) => {
  let conn
  try {
    const { id } = req.params
    conn = await promisePool.getConnection()
    const product = await productService.getProduct({ id }, conn)
    res.status(200).json(product)
  } catch (error) {
    next(error)
  } finally {
    if (conn) conn.release()
  }
})

module.exports = router
