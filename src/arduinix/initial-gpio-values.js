import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;

// pin: the gpio number, not the connector number
// other options come from https://github.com/fivdi/pigpio/blob/master/doc/gpio.md#gpiogpio-options

const initialGpioValues ={
  testPin: {
        GpioNumber: 17,
        options: {
          mode: Gpio.OUTPUT,
          pullUpDown: Gpio.PUD_OFF,
        },
        setValue: Gpio.LOW
      }
}
  // etc


export {initialGpioValues};