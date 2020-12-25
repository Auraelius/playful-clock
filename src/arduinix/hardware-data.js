import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;

// Gpio objs for controlling pins
export let pins={};  

// other options come from https://github.com/fivdi/pigpio/blob/master/doc/gpio.md#gpiogpio-options
export const initialGpioValues = 
{
  // anodes are active high and feed a high voltage circuit.
  // each anode lights up a pair of tubes
  anode1: {
    GpioNumber: 4,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  anode2: {
    GpioNumber: 17,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  anode3: {
    GpioNumber: 18,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  anode4: {
    GpioNumber: 27,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },

  // there are two cathode decoder/drivers, one for digit1 and one for digit2 of the tube pair. the digit[1|2]pwm pins are an experiment to see of we can modulate the brightness of the tubes by pulsing the cathodes using the OE (output enable) control of the deccoder

  cathode1a: {
    GpioNumber: 22,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode1b: {
    GpioNumber: 23,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode1c: {
    GpioNumber: 24,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode1d: {
    GpioNumber: 25,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  digit1pwm: {
    GpioNumber: 13,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode2a: {
    GpioNumber: 7,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode2b: {
    GpioNumber: 5,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode2c: {
    GpioNumber: 6,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  cathode2d: {
    GpioNumber: 12,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  },
  digit2pwm: {
    GpioNumber: 26,
    options: {
      mode: Gpio.OUTPUT,
      pullUpDown: Gpio.PUD_OFF,
    },
    setValue: 0
  }
  // etc
};

export const shutdownGpioValues = {
 anode1: {
    GpioNumber: 4,
    setValue: 0
  },
  anode2: {
    GpioNumber: 17,
    setValue: 0
  },
  anode3: {
    GpioNumber: 18,
    setValue: 0
  },
  anode4: {
    GpioNumber: 27,
    setValue: 0
  },
  cathode1a: {
    GpioNumber: 22,
    setValue: 0
  },
  cathode1b: {
    GpioNumber: 23,
    setValue: 0
  },
  cathode1c: {
    GpioNumber: 24,
    setValue: 0
  },
  cathode1d: {
    GpioNumber: 25,
    setValue: 0
  },
  digit1pwm: {
    GpioNumber: 13,
    setValue: 0
  },
  cathode2a: {
    GpioNumber: 7,
    setValue: 0
  },
  cathode2b: {
    GpioNumber: 5,
    setValue: 0
  },
  cathode2c: {
    GpioNumber: 6,
    setValue: 0
  },
  cathode2d: {
    GpioNumber: 12,
    setValue: 0
  },
  digit2pwm: {
    GpioNumber: 26,
    setValue: 0
  }
};



