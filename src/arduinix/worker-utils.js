import logger from '../logger.js'
import { nextValue, nextValueStatusEnum as s } from './worker-mux-interface.js';

// interface to hardware
import pigpio from 'pigpio';
const Gpio = pigpio.Gpio;
import { pins } from './hardware-data.js'

// persistant private storage
let currentValue = {      // the number we are displaying
  digits: '01230000',
  brightness: '99999999'
}; 
let tubePair = 0;
// let numberOfPairs = process.env.NUMBER_OF_TUBES/2; //! this isn't ready when we start the mux
let numberOfPairs = 4;
console.log(`tubeMultiplexer: process.env.NUMBER_OF_TUBES: ${process.env.NUMBER_OF_TUBES},numberOfPairs: ${numberOfPairs}`)

//----------------------------------------------------------------//--
export function tubeMultiplexer (){
  /* 
    every time this wakes up, it lights up the current pair of tubes
    by setting the raspi gpio pins appropriately
    then it checks for new values, sets things up for the next pair, and goes to sleep.
  */
  try {
    displayNumberPair(tubePair, currentValue); 
  } catch(e) {
    throw (`tubeMultiplexer: could not set GPIO pins. displayNumberPair: ${tubePair}, Error: ${e}`);
  } //? who catches this?

  tubePair += 1; // let's set up the next pair
  if (tubePair < numberOfPairs) { // more pairs to go; back to sleep
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

function displayNumberPair(pair, value){
  // logger.info(`displayNumberPair: pair: ${pair} digits: ${value.digits} brightness: ${value.brightness}`)
  // logger.info(`displayNumberPair: pins: ${pins}` )

  if(isEmpty(pins)) throw 'displayNumberPair: empty pins object'; // did we forget to set up?
 
  turnOffAllTubes() // disable anodes for all pairs (no high voltage)
  setCathodes(pair, value); 
  // setBrightness(pair, value); // set the PWM on output enables from the brightness
  setAnode(pair); // enable the anode for this pai
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function turnOffAllTubes(){
  // logger.info(`TurnOffAllTubes`);
  pins.anode1.digitalWrite(0);
  pins.anode2.digitalWrite(0);
  pins.anode3.digitalWrite(0);
  pins.anode4.digitalWrite(0);
}

function setCathodes(pair, value){
  // logger.info(`setCathodes`);
  // Load the a,b,c,d.. to send to the SN74141 IC (1)
  // This method looks up a set of four pin values using 
  // a switch statement. We will use an array to save time
  // and code space when things get more complicated.

  // pair goes from 0-3
  // todo adapt this to smaller tube sets (2,4,6) based on process.env.NUMBER_OF_TUBES
  let [a,b,c,d] = bcd(value.digits[pair])
  
  // for debug - output info on the same line over and over
  process.stdout.write(`setCathodes: pair: ${pair} digits: ${value.digits} abcd: ${a}${b}${c}${d}\r`)

  pins.cathode1a.digitalWrite(a);
  pins.cathode1b.digitalWrite(b);
  pins.cathode1c.digitalWrite(c);
  pins.cathode1d.digitalWrite(d);
  [a,b,c,d] = bcd(value.digits[pair+4])
  pins.cathode2a.digitalWrite(a);
  pins.cathode2b.digitalWrite(b);
  pins.cathode2c.digitalWrite(c);
  pins.cathode2d.digitalWrite(d);
} 

function bcd(numeral){
  // these values come from an old 5441/7441 BCD decoder & Nixie Driver datasheet
  // the values for blanks are what the 74141 needs to inhibit output
  // BUT with the 5441 this will display as '5'. 
  // and we'll have to blank that digit some other way

  let a,b,c,d;
  
  switch (numeral) {
    case '0': d=0; c=0; b=0; a=0; break; 
    case '1': d=0; c=0; b=0; a=1; break; 
    case '2': d=0; c=0; b=1; a=0; break; 
    case '3': d=0; c=0; b=1; a=1; break; 
    case '4': d=0; c=1; b=0; a=0; break; 
    case '5': d=0; c=1; b=0; a=1; break; 
    case '6': d=0; c=1; b=1; a=0; break; 
    case '7': d=0; c=1; b=1; a=1; break; 
    case '8': d=1; c=0; b=0; a=0; break; 
    case '9': d=1; c=0; b=0; a=1; break; 
    case ' ':
    case 'b':
      a=1; b=1; c=1; d=1
  }

  return [a,b,c,d];
}

function setBrightness(pair, value){
// right now we are just disabling the digit output if the digit is a ' ' or 'b' or the brightness is 0
// todo we will figure out how to PWM the output enable next
  // todo adapt this to smaller tube sets (2,4,6) based on process.env.NUMBER_OF_TUBES

  let output1, output2 = 0;
  const blank = RegExp(/ |b/) // look for a ' ' or a 'b'
  if( blank.test(value.digits[pair]) || value.brightness[pair] == 0 ){
    output1 = 1; // disable output
  }
  if( blank.test(value.digits[pair+4]) || value.brightness[pair+4] == 0 ){
    output2 = 1;
  }
  // ! These throw an exception
  // pins.digit1pwm.digitalWrite(output1);
  // pins.digit2pwm.digitalWrite(output2);
  return true;
}

function setAnode(pair){
  switch (pair) {
    case 0:
      pins.anode1.digitalWrite(1);
      break;
    case 1:
      pins.anode2.digitalWrite(1);
      break;
    case 2:
      pins.anode3.digitalWrite(1);
      break;
    case 3:
      pins.anode4.digitalWrite(1);
      break;
  }
  return true;
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

