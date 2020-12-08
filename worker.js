/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('foo');
const worker = new Worker('foo', async (job) => {
  console.log(job.data);
});