const CONFIG = {
  // Listening port
  PORT: 4001,
  // (optional) listening port for turning off the LED
  RESET_PORT: 4002,
  // Returned response
  BROWSER_OUTPUT: `
    The LED is likely flashing right now.
  `,
  // TODO: Ability to choose DB file

  // LED GPIO pins for RGB LED
  LED_GPIO_PIN_RED: 4, // GPIO NAME, not POSITION. Position is 7
  LED_GPIO_PIN_GREEN: 17, // GPIO NAME, not POSITION. Position is 11
  LED_GPIO_PIN_BLUE: 27, // GPIO NAME, not POSITION. Position is 13

  // Anode (feed in 3.3V via "ground" pin, set other pins to "low" to increase hue)
  IS_ANODE: true,
  // OFF: {get: () => IS_ANODE ? 1 : 0}, // TODO: explore later
  // ON: {get: () => IS_ANODE ? 0 : 1},

  LIGHT_PATTERN: 'police', // function name
  LIGHT_INTERVAL: 200, // Time until color change in ms
  LIGHT_DURATION: 5000 // Time before LED turns off in ms
}

module.exports = CONFIG
