const { fileProcessorWorker } = require('../modules/helper');

const { workerData, parentPort } = require('worker_threads');

fileProcessorWorker(workerData, workerData.thread_index).then((e) => {
  console.log(`Process completed with thread index:`, workerData.thread_index);
  parentPort.postMessage({ success: e });
  setTimeout(() => {
    cleanup();
  }, 500);
});
