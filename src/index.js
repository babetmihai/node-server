const { PORT } = process.env
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const controllers = require('./controllers')

const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'DELETE']
}))
app.use(controllers)

module.exports = async () => app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
