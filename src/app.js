/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

// This is an express server for driving a display of nixies and gauges
// it uses a BullMQ message queue to send values to a separate node process 
// that has to run as root in order to control the GPIO hardware

// configuration variables
import dotenv from 'dotenv';

// here are all the web server pieces
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

// These are the queuing pieces, including an admin interface
import { Queue, Worker, QueueScheduler } from 'bullmq';
import { setQueues, BullMQAdapter, BullAdapter, router } from 'bull-board';

// Finally, here's our code:
import logger from './logger.js';
import errorHandler from './error-handler.js';
// import validateBearerToken from './validate-bearer-token.js';

// let's get down to business

// setup app
const configuration = dotenv.config();
configuration.error ? logger.error(configuration.error):logger.info("Startup configuration:", configuration.parsed);
const NODE_ENV = process.env.NODE_ENV;

// set up queue
// todo check for errors in the following steps (IN CASE REDIS ISN'T RUNNING, ETC)
const valueQueue = new Queue('device-values');
setQueues([new BullAdapter(valueQueue)]);

// enable delayed jobs in our queue for device
const myQueueScheduler = new QueueScheduler('device-values');

// set up express
export const app = express();

// start middleware pipline

// logging
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
// security
app.use(cors());
app.use(helmet());
// app.use(validateBearerToken);

// all endpoints take json payloads if they take one at all
app.use(express.json());

// put our routes here
app.use('/admin/queues', router); //bullmq administrative interface


app.post('/value', async (req, res, next)=>{
  // todo validate request
  const newValue = req.body; // should have value and intensity properties
  console.table(newValue);
   await valueQueue.add('newValue', newValue);
   res.sendStatus(200);
})


// proof of life
app.get('/', (req, res) => {
  res.send('Nixie server is listening');
});

// error handlers
app.use(errorHandler);

export default app;