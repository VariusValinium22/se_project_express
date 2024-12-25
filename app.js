const express = require("express");
const mongoose = require  ("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const PORT = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

// TODO: to be removed once login/authentication is implemented
// Mock a user for POST Add an Item
app.use((req, res, next) => {
  req.user = {_id: "6765a6944882aba552ef7ea5"};
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
