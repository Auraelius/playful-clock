/* 
  this worker takes three commands from the `device-values` queue

  setup - set up hardware and start multiplexer
  display - display the given value at the given brightness
  shutdown - stop the mux and set the hardware to off state

  it returns error status if unable to accomplish the request
  it calls the done() method
*/
import dotenv from 'dotenv';
import Queue from 'bull';

// our stuff
import logger from '../logger.js';
import { nextValue, nextValueStatusEnum as s } from './worker-mux-interface.js';
import { invalidDisplayJobData } from './invalid-display-job-data.js';
import { tubeMultiplexer } from './worker-utils.js';
import { setUpArduinix, shutDownArduinix } from './setup-utils.js';

// setup worker from configuration environment variables
const configuration = dotenv.config();
configuration.error
  ? logger.error('Worker startup error: ', configuration.error)
  : logger.info('Worker startup configuration: ', configuration.parsed);

// attach to the correct queue 
// todo catch and log errors
const deviceQueue = new Queue('device-values'); 

//  common variables
let tubeMuxTimer = {}; // created when we start mux. used to shut mux down
const tubeMuxInterval = process.env.TUBE_MUX_INTERVAL_MS;

//----------------------------------------------------------------//--
// worker processing

// ? currently doesn't have error checking but the try/catch will be useful later
deviceQueue.process('setup', async (job, done) => {
  logger.info('worker: got SETUP command');
  try {
    setUpArduinix();
    tubeMuxTimer = setInterval(() => {tubeMultiplexer()},  tubeMuxInterval);
    logger.info('worker: setup successful');
    done(null, 'setup successful'); // signal job successful
  } catch(e) {
    logger.error(`worker setup exception: ${e}`);
    done(`worker setup exception: ${e}`);
  }
});

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

deviceQueue.process('shutdown', async (job, done) => {
  logger.info('worker got SHUTDOWN command');
  try {
    clearInterval(tubeMuxTimer);
    shutDownArduinix();
    logger.info('worker stopped the mux, and shut down the arduinix');
    done(null, 'shutdown successful'); // signal job successful
  } catch {
    logger.error('worker could not stop the mux or shutdown the hardware');
    done(new Error('worker could not stop the mux or shutdown the hardware'));
  }
});
