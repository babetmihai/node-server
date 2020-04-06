require('dotenv').config()
const mysql = require('mysql2')
const { DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA } = process.env
const dbSeed = require('../src/db/seed')

const init = async () => {
  const conn = await mysql.createConnectionPromise({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_SCHEMA
  })
  await dbSeed(conn)
  await conn.end()
}

init()