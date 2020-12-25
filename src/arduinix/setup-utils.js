import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;
import { pins, initialGpioValues, shutdownGpioValues} from './hardware-data.js'
import logger from '../logger.js';

export function setUpArduinix (){
  logger.info('worker: setUpArduinix: starting'); 
  setGpioValues(pins, initialGpioValues)
  // todo Error checking!
  return true;
}

export function shutDownArduinix(){
  /* 
    this sets the raspi GPIO pins to their quiescent state
    we don't need to set the mode or create new pin objects
    we will dereference the pin objects so they can be garbage collected
    * you have to go through a setup sequence again.
  */
  logger.info('worker: shutDownArduinix: starting');
  for (let [pinName, setup] of Object.entries(shutdownGpioValues)) {
    pins[pinName].digitalWrite(setup.setValue)
  }
  pins = {}; // free up pin objects for garbage collection
  logger.info('worker: shutDownArduinix: complete');
  return true;
}

function setGpioValues(pins, gpioValues){
  // takes
  // pin objects and pin configuration objects
  // updates the pin object containing the gpio objects needed for accessing that pin
  logger.info('worker: setGpioValues: starting');
  for (let [pinName, setup] of Object.entries(gpioValues)) {
    ////logger.info(`worker: setGpioValues: pinName: ${pinName}, setup: ${Object.entries(setup)}`);
    //todo check to see if we are changing a pin and make sure we do that without messing up hardwa

    // * note that we create the pin objects here and we dereference them in shutDownArduinix()

    pins[pinName] = new Gpio(setup.GpioNumber, setup.options); // sets mode on pin
    pins[pinName].digitalWrite(setup.setValue); // sets initial value of pin
  }
  return true;
}
/*
this is used like this: Say there's a pin named CathodeB
to write a low on this pin, use

pins[CathodeB].digitalWrite(0)

? does this work?
pins.CathodeB.digitalWrite(1)

*/