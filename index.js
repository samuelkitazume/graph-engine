const OrientDB = require('orientjs')
const NATS = require('nats')
const express = require('express')
const bodyParser = require('body-parser')
const app = require('./src/app')

const server = express()
const orient = OrientDB({
  host: 'orientdb',
  port: process.env.ORIENT_PORT,
  username: 'root',
  password: process.env.ORIENT_PWD
})
const nats = NATS.connect({ url: `nats://nats:${process.env.NATS_PORT}`, reconnect: true, json: true })

server.use(bodyParser.json())

app({ server, nats, orient })

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
