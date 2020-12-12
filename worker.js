/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('device-values');
const worker = new Worker('device-values', async (job) => {
  console.table(job.data);
});