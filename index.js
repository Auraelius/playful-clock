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


const worker = new Worker('foo', async (job) => {
  // Will print jobs as they come in
  console.log(job.data);
});

