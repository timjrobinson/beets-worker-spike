import { Job, Queue, Worker } from 'bullmq';
import { v4 } from 'uuid'

const workerId = v4().slice(0, 8);
const NETWORKS = [111, 222, 333, 444, 555];

const loadTokenPrices = new Queue('loadTokenPrices');
const updatePools = new Queue('updatePools');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startWork() {
  const repeatableJobs = await loadTokenPrices.getRepeatableJobs();
  console.log("repeatable: ", repeatableJobs);
  for (const network of NETWORKS) {
    setInterval(async () => {
      await loadTokenPrices.add(`loadTokenPrices-${network}`, {
        network
      }, {
        jobId: `loadTokenPrices-${network}`,
        removeOnComplete: true,
        removeOnFail: true,
      });
    }, 1000);

    setInterval(async () => {
      await updatePools.add(`updatePools-${network}`, {
        network
      }, {
        jobId: `updatePools-${network}`,
        removeOnComplete: true,
        removeOnFail: true,
      });
    }, 5000);

    new Worker('loadTokenPrices', async (job: Job) => {
      console.log(`${Date.now()} - Worker ${workerId} starting job ${job.name}, id: ${job.id}`);
      await timeout(Math.random() * 5000 + 500);
      console.log(`${Date.now()} - Worker ${workerId} finished job ${job.name}, id: ${job.id}`);
    });

    new Worker('updatePools', async (job: Job) => {
      console.log(`${Date.now()} - Worker ${workerId} starting job ${job.name}, id: ${job.id}`);
      await timeout(Math.random() * 30000);
      console.log(`${Date.now()} - Worker ${workerId} finished job ${job.name}, id: ${job.id}`);
    });


  }
}


startWork();