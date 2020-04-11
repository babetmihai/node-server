const { PORT, TOKEN } = process.env

const axios = require('axios')
const assert = require('assert')

it('it should create and list products', async () => {
  await axios.post(
    `http://localhost:${PORT}/products`,
    { name: 'test1' },
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  )
  await axios.post(
    `http://localhost:${PORT}/products`,
    { name: 'test2' },
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  )

  const { data } = await axios.get(
    `http://localhost:${PORT}/products`,
    {
      params: { search: 'est', pageNo: 0, pageSize: 100 },
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  )

  const hasItem = Object.values(data).some((item) => item.name === 'test2')
  assert.equal(data.length, 2)
  assert.equal(hasItem, true)
})
