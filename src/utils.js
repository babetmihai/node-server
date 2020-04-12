const { Transform } = require('stream')

const objstream = () => new Transform({
  objectMode: true,
  transform(chunk, encoding, next) {
    if (!this.started) {
      this.push('[')
      this.started = true
    } else {
      this.push(',')
    }

    this.push(JSON.stringify(chunk))
    next()
  },
  flush(next) {
    if (!this.started) this.push('[')
    this.push(']')
    next()
  }
})

module.exports = {
  objstream
}