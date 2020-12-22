import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;

const shutdownGpioValues = {
  testPin: {
    GpioNumber: 17,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: Gpio.LOW,
  },
};

export {shutdownGpioValues}