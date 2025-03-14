const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const {PORT = 3001} = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

const corsOptions = {
  origin: ['https://wtwr.flazzard.com', 'https://www.wtwr.flazzard.com', 'https://api.wtwr.flazzard.com'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Enable the requesLogger BEFORE all route handlers
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// app.use(routes);
app.use("/", mainRouter);
// Enable the errorLogger AFTER all route handlers
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
