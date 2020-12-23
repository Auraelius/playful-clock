
import logger from '../logger.js';
import Queue from 'bull';
const valueQueue = new Queue('device-values');

export default function clock(){
  logger.info("clock: tick!");
  /*

  this needs to run once a second
  
  let options ={
    cycles: 0,
    startingDelay:0, 
    cycleDelay:1000
  }
  startAimmation('clock', options);
*/


}