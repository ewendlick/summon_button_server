const Gpio = require('onoff').Gpio

const CONFIG = require('./config')
const OFF = CONFIG.IS_ANODE ? 1 : 0
const ON = CONFIG.IS_ANODE ? 0 : 1

// use GPIO, set as output
const LED_R = new Gpio(CONFIG.LED_GPIO_PIN_RED, 'out')
const LED_G = new Gpio(CONFIG.LED_GPIO_PIN_GREEN, 'out')
const LED_B = new Gpio(CONFIG.LED_GPIO_PIN_BLUE, 'out')

class LED {
  constructor() {
    this.allOff()
    let LEDInterval, LEDTimeout
  }

  allOff () {
    LED_R.writeSync(OFF)
    LED_G.writeSync(OFF)
    LED_B.writeSync(OFF)
  }

  run () {
    if(this.LEDInterval || this.LEDTimeout) {
      this.endBlink()
    }
    this.LEDInterval = setInterval(this.policeLED, CONFIG.LIGHT_INTERVAL)
    this.LEDTimeout = setTimeout(this.endBlink, CONFIG.LIGHT_DURATION)
  }

  // TODO: define the function in the config
  policeLED () {
    if (LED_R.readSync() === OFF) {
      LED_R.writeSync(ON)
      LED_B.writeSync(OFF)
    } else {
      LED_R.writeSync(OFF)
      LED_B.writeSync(ON)
    }
  }

  endBlink () {
    clearInterval(this.LEDInterval)
    clearTimeout(this.LEDTimeout)
    LED_R.writeSync(OFF)
    LED_G.writeSync(OFF)
    LED_B.writeSync(OFF)
  }

  destroy () {
    this.endBlink()
    // Unexport to free resources
    LED_R.unexport()
    LED_G.unexport()
    LED_B.unexport()
  }
}

module.exports = LED
