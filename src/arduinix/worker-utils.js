/* 
  this utility module holds some storage for the nitty gritty details
  and a bunch of functions for manipulating those details

  there are other utilities that don't need access to these common data structures
*/
import logger from '../logger.js'

// interface from worker 
import { nextValue, nextValueStatusEnum as s } from './worker-mux-interface.js';

// interface to hardware
import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;
import { pins } from './hardware-data.js'

// persistant private storage
let currentValue = {      // the number we are displaying
  digits: '12345678',
  brightness: '99999999'
}; 
let tubePair = 0;
let numberOfPairs = process.env.NUMBER_OF_TUBES/2;
//----------------------------------------------------------------//--
export function tubeMultiplexer (){
  /* 
    every time this wakes up, it lights up the current pair of tubes
    by setting the raspi gpio pins appropriately
    then it checks for new values, sets things up for the next pair, and goes to sleep.
  */

  // todo remove this for faster performance (but continue to gather timing metrics)
  // // logger.info(`worker-utils: tubeMultiplexer: starting. tubePair: ${tubePair}`);
  try {
    displayNumberPair(tubePair, currentValue, pins ); 
  } catch(e) {
    throw (`tubeMultiplexer: could not set GPIO pins. displayNumberPair: ${tubePair}, Error: ${e}`);
  } //? who catches this?

  if (tubePair++ < numberOfPairs) { // more pairs to go; back to sleep
    return true; 
  } else if (nextValue.status === s.ACCEPTED || nextValue.status === s.DISPLAYED ) {
    // looks like there's no new newValue (that would be status === SET)
    nextValue.status === s.DISPLAYED; //signal we finished with all pairs of last new value
    tubePair = 0; // start over with the first pair of same current value next time
    return true;
  } else if (nextValue.status === s.SET) { // new digits!
    currentValue.digits = nextValue.digits; // copy 'em
    currentValue.brightness = nextValue.brightness;
    nextValue.status = s.ACCEPTED; // tell the boss we're working it
    tubePair = 0;
  } else { // unknown nextValue Status or something else wrong
    throw new Error('tubeMultiplexer: unknown nextValue status or something else wrong');
    // ? WHO CATCHES THIS ERROR?
  }
}

function displayNumberPair(pair, value, pins){
  if(isEmpty(pins)) throw 'displayNumberPair: empty pins object'; // did we forget to set up?
 // disable anodes for all pairs (no high voltage)
// set the cathodes for both digits from the value
// set the PWM on output enables from the brightness
// enable the anode for this pair
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


//----------------------------------------------------------------//--
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

  nextValue.digits = value.digits;
  nextValue.brightness = value.brightness;
  nextValue.accepted = true;
  nextValue.displayed = false;
  // signal we got it but we haven't displayed it yet
  value.accepted = true;
  value.displayed = false;
  return true;
}

