const express = require("express");
const app = express();
const port = 3000;

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

// pm2 start pm2.js -i 0
