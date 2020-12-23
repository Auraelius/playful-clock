/*

  animations are functions that create a series of 
  {value, time-from-start} objects in the queue for a device or display

  only one animation can supply device events at a time. 
  
  starting a new animaton with `startAnimation` will stop any other animation timers
  but it will leave any current device events in the queues so those animations can end smoothly 
 

  note that device queues can get mixed up with unpredictable results if the new animation enqueues events that will be executed before the previous events are finished. We don't check for this situation.
  
  you have the option of running `stopAllAnimations` before startAnimation if you to flush the queues

  Animations are either one-shot or repeating. 
  repeating animations can be set to a specific number of cycles or to repeat indefinitly
  
  startAnimation takes an options object
  
  options = {
    cycles: 0,       // 0: repeat forever, [1 - n]: repeat count
    startingDelay:0, // offset for all events added to device queues
    cycleDelay:0     // offset between cycles
  }

  Note that unless you repeat forever, all the events for all the cycles are enqueued immediately (or at least as fast as bull and redis will take them). The events are delayed into the future by the queueing system.


  todo should the currentAnimations object contain animations who still have events in the queue?
  todo set up listeners to watch the queues and list which animations still have events in the queues
*/


const currentAnimationTimers = []; // of timer objects

import clock from './clock.js';
const registeredAnimations = {
  "clock" : clock
}

import logger from '../logger.js';

/*
  Stops any and all animation processes that may be running
  returns false if it can't stop everything
*/
function stopAllAnimations(){
  logger.info(`stopAllAnimations running`)

// * if there are any timers running, stop them
// * flush all the device queues

  return true;
}

/* 
  let options ={
    cycles: 0,       // 0: repeat forever, [1 - n]: repeat count
    startingDelay:0, // offset for all events added to device queues
    cycleDelay:0
  }
*/

function startAnimation(animationName, options) {
  logger.info(`startAnimation running`);

  // verify that the animationName exists; log and throw if not
  // if it's a one-shot, call the animation routine asynchronously
  // if it's a limited repeater, call it that many times (all cycles will be queued)
  // if it's a endless repeater, set up a timer and add it to currentAnimationTimers

  return true;
}



export {stopAllAnimations, startAnimation}