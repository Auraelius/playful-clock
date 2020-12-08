/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('foo');

// immediate execution of an async func
(async function addJobs() {
  await myQueue.add('myJobName', { foo: 'bar' });
  await myQueue.add('myJobName', { qux: 'baz' });
  await myQueue.add('myJobName', { fhg: 'qwu' });
})();


// todo: put the worker in a separate process that runs with sudo privs
// const worker = new Worker('foo', async (job) => {
//   // Will print jobs as they come in
//   console.log(job.data);
// });

// todo: turn this into an express app so we can run bull-board to monitor things