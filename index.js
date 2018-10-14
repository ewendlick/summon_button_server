'use strict'

const http = require('http')
const ip = require('ip')
const Gpio = require('onoff').Gpio
const sqlite3 = require('sqlite3')
const ON_DEATH = require('death')
const db = require('./db')
const DB = new db()
const CONFIG = require('./config')

// If DB does not exist, create it.
// TODO: die if fail
console.log('creating DB', DB.createIfNotExists())

// TODO: move all of this out into a config file
const port = CONFIG.PORT
const resetPort = CONFIG.RESET_PORT

// use GPIO, set as output
const LED_R = new Gpio(CONFIG.LED_GPIO_PIN_RED, 'out')
const LED_G = new Gpio(CONFIG.LED_GPIO_PIN_GREEN, 'out') // unused
const LED_B = new Gpio(CONFIG.LED_GPIO_PIN_BLUE, 'out')

const OFF = CONFIG.IS_ANODE ? 1 : 0
const ON = CONFIG.IS_ANODE ? 0 : 1

// Turn everything off
LED_R.writeSync(OFF)
LED_G.writeSync(OFF)
LED_B.writeSync(OFF)
let policeLEDInterval, policeLEDTimeout

console.log(`Local IP: ${ip.address()}`)
console.log(`Listening on: ${port}`)

http.createServer((req, res) => {
  if (req.url ==='/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} )
    res.end()
    return
  }

  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Web access hit. Light is probably going')
  console.log(`Connection received at: ${humanReadableDate()}`)

  if(policeLEDInterval || policeLEDTimeout) {
    endBlink()
  }
  policeLEDInterval = setInterval(policeLED, CONFIG.LIGHT_INTERVAL)
  policeLEDTimeout = setTimeout(endBlink, CONFIG.LIGHT_DURATION)

  console.log('Insert to DB', DB.insert({ip: req.connection.remoteAddress}))
}).listen(port)

if (resetPort) {
  console.log(`Reset running on: ${resetPort}`)

  http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Reset')
  }).listen(resetPort)
}

function policeLED () {
  if (LED_R.readSync() === OFF) {
    LED_R.writeSync(ON)
    LED_B.writeSync(OFF)
  } else {
    LED_R.writeSync(OFF)
    LED_B.writeSync(ON)
  }
}

function endBlink () {
  clearInterval(policeLEDInterval)
  clearTimeout(policeLEDTimeout)
  LED_R.writeSync(OFF)
  LED_G.writeSync(OFF)
  LED_B.writeSync(OFF)
}

function cleanup () {
  endBlink()
  // Unexport to free resources
  LED_R.unexport()
  LED_G.unexport()
  LED_B.unexport()
}

function humanReadableDate () {
  const now = new Date
  return now.toISOString().replace('T', ' ').substr(0, 19)
}

ON_DEATH(function(signal, err) {
  cleanup()
  if (signal) {
    console.log(signal)
  } else {
    console.log(err)
  }
  DB.close()
})
