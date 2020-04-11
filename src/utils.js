const { Transform } = require('stream')

const transformJSON = () => new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    if (this.notFirst) {
      this.push(',')
    } else {
      this.push('[')
      this.notFirst = true
    }

    this.push(JSON.stringify(chunk))
    cb()
  },
  flush(cb) {
    this.push(']')
    cb()
  }
})

module.exports = {
  transformJSON
}