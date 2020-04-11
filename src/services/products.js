const uuidv1 = require('uuid/v1')
const { Transform } = require('stream')

const createProduct = async ({ name }, conn) => {
  if (!name) throw new Error('missing.fields')
  const id = uuidv1()
  const product = { id, name }
  await conn.query('INSERT INTO products SET ?', product)
  return product
}

const getProduct = async ({ id }, conn) => {
  const [[product]] = await conn.query(`
    SELECT * FROM products 
    WHERE products.id = ?
  `, [id])
  if (!product) throw new Error('not.found')
  return product
}

const getProducts = async ({ search, pageSize, pageNo  }, conn) => {
  const [products] = await conn.query(`
    SELECT * FROM products 
    WHERE products.name LIKE ?
    ORDER BY products.created DESC
    LIMIT ?,?
  `, [`%${search}%`, pageNo * pageSize, pageSize])
  return products
}

const streamProducts = ({ search, pageSize, pageNo }, streamableConn) => {
  return streamableConn.query(`
    SELECT * FROM products 
    WHERE products.name LIKE ?
    ORDER BY products.created DESC
    LIMIT ?,?
  `, [`%${search}%`, pageNo * pageSize, pageSize])
    .stream()
    .pipe(new Transform({
      objectMode: true,
      transform(chunk, encoding, cb) {
        if (this.notFirst) {
          this.push(',')
        } else {
          this.push('[')
        }

        this.push(JSON.stringify(chunk))
        this.notFirst = true
        cb()
      },
      flush(cb) {
        this.push(']')
        cb()
      }
    }))
}

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  streamProducts
}
