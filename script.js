const { Worker } = require('worker_threads');
const fs = require('fs');

const THREAD_POOL = 10;

let queueCount = 0;

const acquireThreadPool = async () => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      if (queueCount < THREAD_POOL) {
        queueCount++;
        return resolve();
      } else {
        return resolve(acquireThreadPool());
      }
    }, 1000);
  });
};

function runService(csvFilePath, thread_index) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/workers/fileProcessor.worker.js', {
      workerData: {
        csvFilePath,
        thread_index,
      },
    });
    worker.on('message', () => {
      queueCount--;
      resolve();
    });
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

const getFiles = (dir = 'data-dump') => {
  let distFolder = process.cwd() + '/' + dir;
  return fs.readdirSync(distFolder).map((e) => {
    return distFolder + '/' + e;
  });
};

async function run() {
  // LIST OF ALL FILES
  let allFiles = getFiles('migration-data');
  console.log('Files to process:', allFiles.length);

  allFiles.map(async (e, i) => {
    await acquireThreadPool();
    console.log('Pool Aquired');
    runService(e, i + 1);
  });
}

run().catch((err) => console.error(err));
