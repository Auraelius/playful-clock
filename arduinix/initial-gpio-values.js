import {pigpio} from 'pigpio';
const Gpio = pigpio.Gpio;

// pin: the gpio number, not the connector number


const initialGpioValues ={
  CathodeB: {
        GpioNumber: 17,
        options: {
          mode: Gpio.OUTPUT,
          pullUpDown: Gpio.PUD_OFF,
        },
        initialValue: Gpio.LOW
      }
}
  // etc


export {initialGpioValues}