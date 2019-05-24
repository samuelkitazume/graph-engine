const express = require('express')
const bodyParser = require('body-parser')
const app = require('./src/app')

const server = express()

server.use(bodyParser.json())

app(server)

server.listen(7000, (err) => {
  console.log('Graph-engine working on 7000')
})