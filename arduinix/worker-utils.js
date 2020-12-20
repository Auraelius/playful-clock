/* 
  this utility module holds some storage for the nitty gritty details
  and a bunch of functions for manipulating those details
*/
import logger from '../src/logger.js';

// interface from worker 
import { nextValue, nextValueStatusEnum as s } from './worker-mux-interface.js';

//----------------------------------------------------------------//--
// persistant private storage
const pins = {} // Gpio objs for controlling pins
const currentValue = {
  digits: '12345678',
  brightness: '99999999'
}; // the number we are displaying
let tubePair = 0;
let numberOfPairs = process.env.NUMBER_OF_TUBES/2;

export function tubeMultiplexer (nextValue){
  /* 
    every time this wakes up, it lights up the current pair of tubes
    by setting the raspi gpio pins appropriately
    then it checks for new values, sets things up for the next pair, and goes to sleep.
  */

  // todo remove this for faster performance (but continue to gather timing metrics)
  logger.info(`worker-utils: tubeMultiplexer: starting. tubePair: ${tubePair}`);

  try {
    displayNumberPair(tubePair, currentValue, pins, ); // display the current pair
  } catch(e) {
    throw (`tubeMultiplexer: could not set GPIO pins. displayNumberPair: ${e}`);
  }

  

  if (tubePair++ < numberOfPairs) { // more pairs to go; back to sleep
    return true; 
  } else if (nextValue.status === s.ACCEPTED || nextValue.status === s.DISPLAYED ) {
    // looks like there's no new newValue
    nextValue.status === s.DISPLAYED;
    tubePair = 0; // start over with the first pair next time
    return true;
  } else if (nextValue.status === s.SET) { // new digits!
    currentValue.digits = nextValue.digits;
    currentValue.brightness = nextValue.brightness;
    nextValue.status = s.ACCEPTED;
    tubePair = 0;
  } else { // unknown nextValue Status or something else wrong
    throw new Error('tubeMultiplexer: unknown nextValue status or something else wrong');
  }
}

function displayNumberPair(pair, value, pins){
  if(isEmpty(pins)) throw 'displayNumberPair: empty pins object'; // did we forget to set up?
 // moremoremore
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

//----------------------------------------------------------------//--

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
