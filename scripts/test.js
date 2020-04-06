require('dotenv').config({ path: './.test.env' })
const { DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA } = process.env
const mysql = require('mysql2')
const Mocha = require('mocha')
const fs = require('fs')
const path = require('path')
const dbSeed = require('../src/db/seed')
const server = require('../src')

const runTests = async () => {
  const conn = await mysql.createConnectionPromise({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_SCHEMA
  })
  await dbSeed(conn)
  await conn.end()

  const mocha = new Mocha()
  fs.readdirSync('tests')
    .filter((file) => file.substr(-3) === '.js')
    .forEach((file) => {
      mocha.addFile(
        path.join('tests', file)
      )
    })
  const app = await server()
  mocha.run((failures) => {
    app.close()
    process.exitCode = failures ? 1 : 0
    process.exit()
  })
}

runTests()

