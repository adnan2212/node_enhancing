const cluster = require("cluster");
const express = require("express");
const app = express();
const port = 3000;

// console.log(cluster.isMaster);

if (cluster.isMaster) {
  // creates multiple instances
  cluster.fork();
  // cluster.fork ();
  // cluster.fork();
  // cluster.fork();
} else {
  function doSomething(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  }

  app.get("/", (req, res) => {
    doSomething(5000);
    res.send("Helloe there!!");
  });

  app.get("/fast", (req, res) => {
    res.send("This was fast.");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
