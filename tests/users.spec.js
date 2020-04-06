const { PORT, TOKEN } = process.env

const jwt = require('jsonwebtoken')
const assert = require('assert')
const axios = require('axios')

it('it should create a user and login', async () => {
  await axios.post(
    `http://localhost:${PORT}/users`,
    { email: 'mihai.babet@test.com', password: 'test' },
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  )

  // login and fetch token
  const { data } = await axios.post(
    `http://localhost:${PORT}/login`,
    { email: 'mihai.babet@test.com', password: 'test' }
  )

  const { email } = jwt.decode(data.token)
  assert.deepEqual(email, 'mihai.babet@test.com')
})