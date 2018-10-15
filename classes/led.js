const Gpio = require('onoff').Gpio

const CONFIG = require('../config')
const OFF = CONFIG.IS_ANODE ? 1 : 0
const ON = CONFIG.IS_ANODE ? 0 : 1

// use GPIO, set as output
const LED_R = new Gpio(CONFIG.LED_GPIO_PIN_RED, 'out')
const LED_G = new Gpio(CONFIG.LED_GPIO_PIN_GREEN, 'out')
const LED_B = new Gpio(CONFIG.LED_GPIO_PIN_BLUE, 'out')

class LED {
  constructor() {
    this.allOff()
    this.LEDInterval = null
    this.LEDTimeout = null
    this.BLINK_PATTERN = this.setPattern()
  }

  setPattern () {
    switch(CONFIG.BLINK_PATTERN) {
      case 'rgb': // red, green, blue
        return () => {
          if (LED_R.readSync() === OFF && LED_G.readSync() === OFF) {
            LED_R.writeSync(ON)
            LED_G.writeSync(OFF)
            LED_B.writeSync(OFF)
          } else if (LED_R.readSync() === ON) {
            LED_R.writeSync(OFF)
            LED_G.writeSync(ON)
            LED_B.writeSync(OFF)
          } else if (LED_G.readSync() === ON) {
            LED_R.writeSync(OFF)
            LED_G.writeSync(OFF)
            LED_B.writeSync(ON)
          } else {
            LED_R.writeSync(ON)
            LED_G.writeSync(OFF)
            LED_B.writeSync(OFF)
          }
        }
      case 'police': // red and blue
      default:
        return () => {
          if (LED_R.readSync() === OFF) {
            LED_R.writeSync(ON)
            LED_B.writeSync(OFF)
          } else {
            LED_R.writeSync(OFF)
            LED_B.writeSync(ON)
          }
        }
    }
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
    this.LEDInterval = setInterval(this.BLINK_PATTERN, CONFIG.BLINK_INTERVAL)
    this.LEDTimeout = setTimeout(this.endBlink.bind(this), CONFIG.BLINK_DURATION)
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
