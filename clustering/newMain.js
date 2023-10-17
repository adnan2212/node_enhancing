const { Worker, isMainThread } = require("worker_threads");
const fs = require("fs");
const readline = require("readline");

if (isMainThread) {
  // Main thread logic
  const dataFilePath = "sample_data.csv"; // Replace with the path to your CSV file
  const numWorkers = 4; // Number of worker threads to create

  // Read and split data from the CSV file
  const dataChunks = readAndSplitData(dataFilePath, numWorkers);

  // Create and manage worker threads
  const workers = [];

  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker("./newWorker.js", {
      workerData: { chunk: dataChunks[i] },
    });

    worker.on("message", ({ done, processedData }) => {
      if (done) {
        // Handle the processed data as needed
        console.log("Received processed data from a worker:", processedData);
      }
    });

    workers.push(worker);
  }
} else {
  // Worker thread logic
  require("./newWorker.js");
}

function readAndSplitData(filePath, numChunks) {
  const dataChunks = new Array(numChunks).fill([]);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream });

  let chunkIndex = 0;
  let currentChunk = [];

  rl.on("line", (line) => {
    currentChunk.push(line);

    if (currentChunk.length >= Math.ceil(numChunks / (chunkIndex + 1))) {
      dataChunks[chunkIndex] = currentChunk;
      currentChunk = [];
      chunkIndex = (chunkIndex + 1) % numChunks;
    }
  });

  rl.on("close", () => {
    dataChunks[chunkIndex] = currentChunk;
  });

  return dataChunks;
}
