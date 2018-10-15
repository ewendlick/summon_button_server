'use strict'

const http = require('http')
const ip = require('ip')
const sqlite3 = require('sqlite3')
const onServerDeath = require('death')
const db = require('./db')
const DB = new db()
const CONFIG = require('./config')
const led = require('./led')
const LED = new led()

// If DB does not exist, create it.
// TODO: die if fail
console.log('creating DB', DB.createIfNotExists())

// TODO: move all of this out into a config file
const port = CONFIG.PORT
const resetPort = CONFIG.RESET_PORT

console.log(`Local IP: ${ip.address()}`)
console.log(`Listening on: ${port}`)

http.createServer((req, res) => {
  // favicon.ico is requested automatically as a second request. Capture it here
  if (req.url ==='/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} )
    res.end()
    return
  }

  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Web access hit. Light is probably going')
  console.log(`Connection received at: ${humanReadableDate()}`)

  LED.run()

  const insertResult = DB.insertIp(req.connection.remoteAddress)
  console.log('Insert to DB', insertResult)
}).listen(port)

if (resetPort) {
  console.log(`Reset running on: ${resetPort}`)

  http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Reset')
    LED.endBlink()
  }).listen(resetPort)
}

function humanReadableDate () {
  const now = new Date
  return now.toISOString().replace('T', ' ').substr(0, 19)
}

onServerDeath(function(signal, err) {
  LED.destroy()
  if (signal) {
    console.log(signal)
  } else {
    console.log(err)
  }
  DB.close()
})
