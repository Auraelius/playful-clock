/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('device-values');
const worker = new Worker('device-values', async (job) => {

/*  // this worker takes three commands
setup - set up hardware and start multiplexer
display - display the given value at the given brightness
shutdown - stop the mux and set the hardware to off state

todo it responds to commands with confirmation or error status
  */
  
  
  /*
  no no no use the job name as the command
  not a switch
  use job data to pass to handler function then update it with status message after handler returns or throws an exception
  have job producer listen to job status for completion then look at job data
  
  */
  
  const tubeMuxTimer ;
  const tubeMuxInterval = process.env.TUBE_MUX_INTERVAL_MS // todo get this from config
  
  const {command, ...options } = job.data;
  switch (command) {
    case "setup": 
      setUpArduinix();
      multiplexerTimer = setInterval(tubeMultiplexer, tubeMuxInterval);
      logger.info("worker got setup command, set up the arduinix, and started tube multiplexer");
      break;
    case "display": 
      setNextValue(options);
      logger.info("worker got display command, and passed that info off to the mux");
      break;
    case "shutdown": 
      clearInterval(multiplexerTimer);
      shutDownArduinix();
      logger.info("worker got shutdown command, stopped the mux, and shut down the arduinix");
      break;
    default:
      logger.error(`worker got unknown command: ${command}` )
  }
  
  console.table(job.data);
});

function tubeMultiplexer (){}

