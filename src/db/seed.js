module.exports = async (conn) => {
  await conn.query('DROP TABLE IF EXISTS users')
  await conn.query('DROP TABLE IF EXISTS products')
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(50) NOT NULL,
      hash VARCHAR(255),
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}