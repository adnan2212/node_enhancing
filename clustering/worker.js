const fs = require("fs");
const archiver = require("archiver");

const { parentPort, workerData } = require("worker_threads");

const chunk = workerData.chunk;
const chunkIndex = workerData.index;

const output = fs.createWriteStream(`chunk_${chunkIndex}.zip`);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  // Move the generated zip file to the zipFileDirectory
  const newZipFilePath = `${zipFileDirectory}/chunk_${chunkIndex}.zip`;
  fs.renameSync(`chunk_${chunkIndex}.zip`, newZipFilePath);
  parentPort.postMessage({ done: true, chunkIndex });
});

archive.pipe(output);

chunk.forEach((record, index) => {
  // Add your record processing logic here
  // For example, adding each record to the zip file
  archive.append(record, { name: `record_${index}.txt` });
});

archive.finalize();

// const fs = require("fs");
// const archiver = require("archiver");

// const { parentPort, workerData } = require("worker_threads");

// const chunk = workerData.chunk;
// const chunkIndex = workerData.index;
// const zipFileDirectory = workerData.zipFileDirectory; // Add this line

// const output = fs.createWriteStream(`chunk_${chunkIndex}.zip`);
// const archive = archiver("zip", { zlib: { level: 9 } });

// output.on("close", () => {
//   // Move the generated zip file to the zipFileDirectory
//   const newZipFilePath = `${zipFileDirectory}/chunk_${chunkIndex}.zip`;
//   fs.renameSync(`chunk_${chunkIndex}.zip`, newZipFilePath);
//   parentPort.postMessage({ done: true, chunkIndex });
// });

// archive.pipe(output);

// chunk.forEach((record, index) => {
//   // Add your record processing logic here
//   // For example, adding each record to the zip file
//   archive.append(record, { name: `record_${index}.txt` });
// });

// archive.finalize();
