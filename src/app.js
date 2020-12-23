/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

// This is an express server for driving a display of nixies and gauges
// it uses a Bull message queue to send values to a separate node process 
// that has to run as root in order to control the GPIO hardware

// configuration variables
import dotenv from 'dotenv';

// here are all the web server pieces
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

// Here's the message queue system
import Queue  from 'bull'; 
import { setQueues, BullAdapter, router } from 'bull-board';

// Here's our code:
import logger from './logger.js';
import errorHandler from './error-handler.js';
import {
  stopAllAnimations, 
  startAnimation
} from './animations/utils.js';
import validateBearerToken from './validate-bearer-token.js';

// let's get down to business
const app = express();

// setup app - first get environment vars
const configuration = dotenv.config();
configuration.error
  ? logger.error('Startup error: ', configuration.error)
  : logger.info('Startup configuration: ', configuration.parsed);

const NODE_ENV = process.env.NODE_ENV;

// store all the config vars (and allow for tweaking while running)
app.set('TUBE_MUX_INTERVAL_MS', process.env.TUBE_MUX_INTERVAL_MS);
app.set('NUMBER_OF_TUBES', process.env.NUMBER_OF_TUBES);
;

// set up queue

// todo check for errors in the following steps (IN CASE REDIS ISN'T RUNNING, ETC)
const valueQueue = new Queue('device-values');
setQueues([new BullAdapter(valueQueue)]);

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

// proof of life
app.get('/', (req, res) => {
  res.send('Nixie server is listening');
});

// app.use(validateBearerToken);

// all endpoints take a json payload if they take one at all
app.use(express.json());

// put our routes here

app.get('/setup', async (req, res) => {
  logger.info('app: starting GET /setup')
  await valueQueue.add('setup');
  res.sendStatus(200);
});

app.post('/clock', (req, res) => {
  logger.info('app: starting POST /clock')
  stopAllAnimations();
  startAnimation('clock');
  res.sendStatus(200);
});

app.post('/display', async (req, res)=>{
  // todo validate request
  const newValue = req.body; // should have value and intensity properties
  console.table(newValue);
  stopAllAnimations();
  await valueQueue.add('display', newValue);
  res.sendStatus(200);
});

//bull-board administrative interface
app.use('/admin/queues', router); 



// error handlers
app.use(errorHandler);

export default app;