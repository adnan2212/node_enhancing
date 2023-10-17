require("dotenv").config();
const express = require("express");
const { Worker, isMainThread } = require("worker_threads");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json("Hello there");
});

app.get("/download", (req, res) => {
  if (isMainThread) {
    const worker = new Worker("./worker.js");
    worker.on("message", (message) => {
      if (message === "done") {
        res.download("./output.zip", "downloadedData.zip", (err) => {
          if (err) {
            res.status(500).send("Error downloading the file.");
          }
        });
      }
    });
    worker.postMessage("start");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
