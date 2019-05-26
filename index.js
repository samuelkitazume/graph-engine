const NATS = require('nats')
const express = require('express')
const bodyParser = require('body-parser')
const app = require('./src/app')

const server = express()
const nats = NATS.connect({ url: 'nats://0.0.0.0:4222', json: true })

server.use(bodyParser.json())

app({ server, nats })

nats.on('connect', () => {
  server.listen(7000, (err) => {
    console.log('Graph-engine working on 7000')
  })
})

nats.on('error', (e) => {
  throw new Error(e)
})
