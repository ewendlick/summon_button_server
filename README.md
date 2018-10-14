#summon_button_server

##What it is
summon_button_server is half of the "Summon Button" - a button that summons people who have headphones on by flashing an RGB LED to get their attention. (Disclaimer: Actual summoning depends on the mood of the person being summoned)

This is the server side that receives web requests from The Button, and handles the RGB LED.

##Requirements
###Server:
* 1 x Raspberry Pi or device with GPIO headers
* 1 x RGB LED (Anode or Cathode)
* 3 x (100 Ohm)※
* Wires
* Breadboard
※A lot of specs mention different resistances for different colors. I'm using 100 Ohm resistors for each without issue.

###Software:
* Node
* NPM

##Usage:
Settings can be modified in the `config.js` file.

Run the server with `node index.js`. The server will then be listening on the ports specified in the `config.js` file.

All server accesses will be displayed via console.log(), and access information will be stored in a Sqlite DB.
