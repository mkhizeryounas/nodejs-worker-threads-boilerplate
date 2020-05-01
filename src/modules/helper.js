const csv = require('csvtojson');
const fs = require('fs');

const fileProcessorWorker = (params, thread_index = 1) => {
  return new Promise((resolve) => {
    let recordCount = 0;
    let processedRecords = 0;
    const fileStream = fs.createReadStream(params.csvFilePath);
    csv({
      delimiter: '|',
    })
      .fromStream(fileStream)
      .subscribe(
        function (jsonObj) {
          console.log(jsonObj);
          recordCount++;
          processedRecords++;
        },
        function () {
          let flagInterval = setInterval(() => {
            if (processedRecords === recordCount) {
              resolve(false);
              clearInterval(flagInterval);
            }
          }, 1000);
        },
        function () {
          let flagInterval = setInterval(() => {
            if (processedRecords === recordCount) {
              resolve(true);
              clearInterval(flagInterval);
            }
          }, 1000);
        }
      );
  });
};

module.exports = {
  fileProcessorWorker,
};
