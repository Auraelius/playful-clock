/* 
  this worker takes three commands from the `device-values` queue

  setup - set up hardware and start multiplexer
  display - display the given value at the given brightness
  shutdown - stop the mux and set the hardware to off state

  it returns error status if unable to accomplish the request
  it returns the command verb in a success message otherwise
*/

// setup worker from configuration environment variables
import dotenv from 'dotenv';
const configuration = dotenv.config();
configuration.error
  ? logger.error('Worker startup error: ', configuration.error)
  : logger.info('Worker startup configuration: ', configuration.parsed);

// attach to the correct queue
import { Queue } from 'bullmq';
const deviceQueue = new Queue('device-values'); // todo catch and log errors

//  common variables
const tubeMuxTimer; // created when we start mux. used to shut mux down
const tubeMuxInterval = process.env.TUBE_MUX_INTERVAL_MS;

import { nextValue, nextValueStatusEnum as s } from './worker-mux-interface.js';

// worker functions
import {
  tubeMultiplexer,
  setUpArduinix,
  setNextValue,
  shutDownArduinix,
} from './worker-utils.js';

// worker processing

//----------------------------------------------------------------//--
// currently doesn't have error checking but the try/catch will be useful later
deviceQueue.process('setup', async (job, done) => {
  logger.info('worker got SETUP command');
  try {
    setUpArduinix();
    tubeMuxTimer = setInterval(tubeMultiplexer(nextValue), tubeMuxInterval);
    logger.info('worker set up the arduinix and started tube multiplexer');
    done(null, 'setup successful'); // signal job successful
  } catch {
    logger.error(
      'worker could not set up the arduinix or start tube multiplexer'
    );
    done(new Error('could not set up hardware'));
  }
});

//----------------------------------------------------------------//--
deviceQueue.process('display', async (job, done) => {
  logger.info(`worker got DISPLAY command: ${job.data}`);

  if (invalidDisplayJobData(job.data)) {
    logger.error(`worker: invalid job data: ${job.data}`);
    done(new Error('invalid job data'));
  }

  if (nextValue.status === s.SET || nextValue.status === s.ACCEPTED) {
    // we haven't finished displaying the previous number
    // for now we'll see how often this occurs
    logger.warn(
      `Overwriting nextValue ${nextValue.digits} with ${job.data.digits}`
    );
  }

  nextValue.digits = job.data.digits;
  nextValue.brightness = job.data.brightness;
  nextValue.status = s.SET;
  logger.info('worker passed that info off to the mux');
  done(null, 'display finished'); // signal job successful

});



function invalidDisplayJobData(data) {
  return false;
  /*
  if it has keys `digits` and `brightness`
  and those keys have string values
  and those strings are the same length as the number of tubes
  and the chars in the digits are 0-9 or b or ' '
  and the chars in the brightness are 0-9
  then return false
  else return true
  */

 if (!data.hasOwnPropery(digits)) return true;
 if (!data.hasOwnPropery(brightness)) return true;



}


//----------------------------------------------------------------//--
deviceQueue.process('shutdown', async (job, done) => {
  logger.info('worker got SHUTDOWN command');
  try {
    clearInterval(tubeMuxTimer);
    shutDownArduinix(job.data);
    logger.info('worker stopped the mux, and shut down the arduinix');
    done(null, 'shutdown successful'); // signal job successful
  } catch {
    logger.error('worker could not stop the mux or shutdown the hardware');
    done(new Error('worker could not stop the mux or shutdown the hardware'));
  }
});
