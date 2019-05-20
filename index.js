const OrientDB = require('orientjs')
const app = require('./src/app')

const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'foo'
})

const db = server.use('test')
