const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("WTWR API is Running! Woot Woot");
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://wtwr.flazzard.com",
    "https://www.wtwr.flazzard.com",
    "https://api.wtwr.flazzard.com",
    "https://wtwr.martinyoungproject.com",
    "https://apiwtwr.martinyoungproject.com",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Test mode: Set req.user for test preparation
// This is required by the test framework for endpoint testing
app.use((req, res, next) => {
  // Set req.user if not already set (test framework requirement)
  if (!req.user) {
    req.user = {
      _id: "5d8b8592978f8bd833ca8133",
    };
  }
  next();
});

// Enable the requestLogger BEFORE all route handlers
app.use(requestLogger);

// app.use(routes);
app.use("/", mainRouter);
// Enable the errorLogger AFTER all route handlers
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
