const { DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA } = process.env

const mysql = require('mysql2')
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA
})

const promisePool = pool.promise()

module.exports =  {
  pool,
  promisePool
}
