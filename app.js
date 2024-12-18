const express = require("express");
const mongoose = require  ("mongoose");

const app = express();

const PORT = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.errer(e));

app.get("/", (req, res) => {
  res.send("Welcome to the WTWR Applcation Server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
