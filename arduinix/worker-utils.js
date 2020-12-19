/* 
  this utility module holds some storage for the nitty gritty details
  and a bunch of functions for manipulating those details

*/
import logger from '../src/logger.js';

// persistant private storage
const currentValue = {}; // the number we are displaying

let nextValue = {
  // the next number we are going to display
  digits: '12345678',
  brightness: '99999999',
  accepted: false, // set before the first pair is lit
  displayed: false, // set when the last pair has been lit and the mux is ready to accept another newValue
}; 
const pins = {} // Gpio objs for controlling pins


export function tubeMultiplexer (nextValue){
  /* 
    every time this wakes up, it lights up the next pair of tubes
    by setting the raspi gpio pins appropriately
    if it gets to the end of the set of pairs, it checks the nextValue buffer
    if the buffer has a new value, the mux accepts it, sets the nextvalue buffer to null so signal acceptance, and starts the next cycle.
  */
  logger.info('worker: tubeMultiplexer: starting');
  return true;
}

import {initialGpioValues} from './initial-gpio-values.js'
export function setUpArduinix (){
  logger.info('worker: setUpArduinix: starting'); 
  pins = setGpioValues(pins, initialGpioValues)
  // todo Error checking!
  return true;
}

export function setNextValue(jobData, value) {
  /* 
    this validates the new value properties
    it checks to see if the mux has displayed the last value completely (accepted && displayed)
    otherwise it waits for four mux intervals to give the mux time to display the whole thing
    if the next value has not been displayed by then, it throws an error because the mux may have stopped

    When the coast is clear, sets the nextValue.digits, .brightness from the job data 

    sets the nextValue.accepted and nextValue.displayed to false, 
  */
  logger.info('worker: setNextValue: starting');
  if (nextValue.displayed = false) {
    // we haven't finished displaying the previous number
    // shouild we tell the mux to start over with new number?
    // for now we'll see how often this occurs
    logger.warn(
      `Overwriting nextValue ${nextValue.digits} with ${value.digits}`
    );

  }
  nextValue.digits = value.digits;
  nextValue.brightness = value.brightness;
  nextValue.accepted = true;
  nextValue.displayed = false;
  // signal we got it but we haven't displayed it yet
  value.accepted = true;
  value.displayed = false;
  return true;
}

export function shutDownArduinix(jobData){
  /* 
    this sets the raspi GPIO pins to their quiescent state
    todo not sure if we need the jobData
    todo Might want an object that represents the initial state
  */
  logger.info('worker: shutDownArduinix: starting');
  return true;
}

function setGpioValues(pins, gpioValues){
  // takes
  // pin objects and pin configuration objects
  // updates the pin object containing the gpio objects needed for accessing that pin

  for (const [pinName, setup] of Object.entries(gpioValues)) {
    // todo check to see if we are changing a pin and make sure we do that without messing up hardware
    pins[pinName] = new gpioValues(setup.GpioNumber, setup.options); // sets mode on pin
    pins[pin].digitalWrite(setup.initialValue); // sets initial value of pin
  }
}
/*
this is used like this: Say there's a pin named CathodeB
to write a low on this pin, use

pins[CathodeB].digitalWrite(Gpio.LOW)

does this work?
pins.CathodeB.digitalWrite(Gpio.LOW)

*/
