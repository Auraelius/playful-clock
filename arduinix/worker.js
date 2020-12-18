
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
configuration.error ? logger.error(configuration.error):logger.info(configuration.parsed);
import { TUBE_MUX_INTERVAL_MS } from '../config.js';

// attache to the correct queue
import { Queue } from 'bullmq';
const deviceQueue = new Queue('device-values'); // todo catch and log errors

//  common variables
const tubeMuxTimer ; // created when we start mux. used to shut mux down
const tubeMuxInterval = TUBE_MUX_INTERVAL_MS;

// where the mux gets the next value to be displayed
let nextValue = { 
  digits: "12345678",
  brightness: "99999999",
  accepted: false, // set before the first pair is lit
  displayed: false // set when the last pair has been lit and the mux is ready to accept another newValue
}; 

// worker functions
import { tubeMultiplexer, setUpArduinix, setNextValue, shutDownArduinix} from './worker-utils.js';

// worker processing
deviceQueue.process('setup', async (job, done)=> {
  logger.info("worker got SETUP command")
  try {
    setUpArduinix(job.data);
    tubeMuxTimer = setInterval(tubeMultiplexer(nextValue), tubeMuxInterval);
    logger.info("worker set up the arduinix and started tube multiplexer");
    done(null, "setup successful"); // signal job successful
  } catch {
    logger.error("worker could not set up the arduinix or start tube multiplexer");
    done(new Error('could not set up hardware'));
  }
});

deviceQueue.process('display', async (job, done)=> {
  logger.info("worker got DISPLAY command")
  try {
    setNextValue(job.data, nextValue);
    logger.info("worker passed that info off to the mux");
    done(null, "display successful"); // signal job successful
  } catch {
    logger.error("worker could not set the next value");
    done(new Error('could not set the next value'));
  }
});
  
deviceQueue.process('shutdown', async (job, done)=> {
  logger.info("worker got SHUTDOWN command")
  try {
    clearInterval(tubeMuxTimer);
    shutDownArduinix(job.data);
    logger.info('worker stopped the mux, and shut down the arduinix');
    done(null, "shutdown successful"); // signal job successful
  } catch {
    logger.error("worker could not stop the mux or shutdown the hardware");
    done(new Error('worker could not stop the mux or shutdown the hardware'));
  }
});
