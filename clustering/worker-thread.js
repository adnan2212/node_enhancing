const express = require("express");
const app = express();
const { Worker } = require("worker_threads");

let counter = 0;
app.get("/", (req, res) => {
  counter++;
  res.status(200).json({ counter });
});

app.get("/heavy", (req, res) => {
  const worker = new Worker("./worker-file.js");
  worker.on("message", (data) => {
    res.status(200).json({ total: data });
  });
});

app.listen(3000, () => console.log("listening on port 3000"));

/* const express = require("express");
const app = express();
const port = 3000;
const Worker = require("webworker-threads").Worker;

app.get("/", (req, res) => {
  const worker = new Worker(function () {
    this.onmessage = function () {
      // this will be invoked when application call postMessage
      let counter = 0;
      while (counter < 10000000000) {
        counter++;
      }

      postMessage(counter);
    };
  });

  worker.onmessage = function (myCounter) {
    console.log(myCounter);
    res.send(message.data);
  };

  worker.postMessage(); // invoke onmessage of worker
});

app.get("/fast", (req, res) => {
  res.send("This was fast.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */
