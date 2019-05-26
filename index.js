const NATS = require('nats')
const express = require('express')
const bodyParser = require('body-parser')
const app = require('./src/app')

const server = express()
const nats = NATS.connect({ url: 'nats://nats:4222', reconnect: true, json: true })

server.use(bodyParser.json())

app({ server, nats })

const PORT = process.env.PORT || 7777
const HOST = process.env.HOST || "0.0.0.0"

nats.on('connect', () => {
  server.listen(PORT, HOST, (err) => {
    console.log(`Graph-engine working on http://${HOST}:${PORT}`)
  })
})

nats.on('error', (e) => {
  throw new Error(e)
})
