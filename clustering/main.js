const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const fs = require("fs");
const archiver = require("archiver");

if (isMainThread) {
  const dataFilePath = "sample_data.csv";
  const chunkSize = 100000;

  const dataChunks = readData(dataFilePath, chunkSize);

  for (let i = 0; i < dataChunks.length; i++) {
    const worker = new Worker(__filename, {
      workerData: { chunk: dataChunks[i], index: i },
    });

    worker.on("message", ({ done, chunkIndex }) => {
      if (done) {
        console.log(`Chunk ${chunkIndex} processing complete.`);
      }
    });
  }
} else {
  const chunk = workerData.chunk;
  const chunkIndex = workerData.index;

  const output = fs.createWriteStream(`chunk_${chunkIndex}.zip`);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    parentPort.postMessage({ done: true, chunkIndex });
  });

  archive.pipe(output);

  chunk.forEach((record, index) => {
    // Add your record processing logic here
    // For example, adding each record to the zip file
    archive.append(record, { name: `record_${index}.txt` });
  });

  archive.finalize();
}

function readData(dataFilePath, chunkSize) {
  const data = fs.readFileSync(dataFilePath, "utf8");
  const dataLines = data.split("\n");
  const dataChunks = [];

  for (let i = 0; i < dataLines.length; i += chunkSize) {
    dataChunks.push(dataLines.slice(i, i + chunkSize));
  }

  return dataChunks;
}
