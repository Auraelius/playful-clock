
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
  /* 
    This sets up the raspi gpio pins to their proper initial state

    todo not sure if we need the jobData
    todo Might want an object that represents the initial state
  */
  setGpioValues(initialGpioValues)
  
  return true;
}

export function setNextValue(jobData, nextValue) {
  /* 
    this validates the new value properties
    it checks to see if the mux has displayed the last value completely (accepted && displayed)
    otherwise it waits for four mux intervals to give the mux time to display the whole thing
    if the next value has not been displayed by then, it throws an error because the mux may have stopped

    When the coast is clear, sets the nextValue.digits, .brightness from the job data 

    sets the nextValue.accepted and nextValue.displayed to false, 
  */

    
  logger.info('worker: setNextValue: starting');
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


function setGpioValues(gpioValues){
  for (const [pin,setup] of Object.entries(gpioValues)){

  }

 

  }
