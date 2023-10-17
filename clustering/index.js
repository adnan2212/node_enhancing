const express = require("express");
const app = express();

let counter = 0;
app.get("/", (req, res) => {
  counter++;
  res.sendStatus(200).json({ counter });
});

app.get("/heavy", (req, res) => {
  let total = 0;
  for (let i = 0; i < 10000000000; i++) {
    total++;
  }
  res.sendStatus(200).json({ total });
});

app.listen(3000, () => console.log("listening on port 3000"));
