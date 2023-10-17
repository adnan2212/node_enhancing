const express = require("express");
const fs = require("fs");
const archiver = require("archiver");

const app = express();
const port = 3000;

// Define the path where generated zip files are stored
const zipFileDirectory = "./";

app.get("/download/:chunkIndex", (req, res) => {
  const chunkIndex = req.params.chunkIndex;
  const zipFilePath = `${zipFileDirectory}/chunk_${chunkIndex}.zip`;

  if (fs.existsSync(zipFilePath)) {
    res.download(zipFilePath);
  } else {
    res.status(404).send("File not found.");
  }
});

// app.get("/download/:chunkIndex", (req, res) => {
//   const chunkIndex = req.params.chunkIndex;
//   const zipFilePath = `${zipFileDirectory}/chunk_${chunkIndex}.zip`;

//   if (fs.existsSync(zipFilePath)) {
//     res.download(zipFilePath);
//   } else {
//     console.log(`File not found: ${zipFilePath}`);
//     res.status(404).send("File not found.");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
