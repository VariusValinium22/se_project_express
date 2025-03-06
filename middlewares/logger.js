const winston = require("winston");
const expressWinston = require("express-winston");
const { translateAliases } = require("../models/user");

// use a built-in timestamp method
// use a generic printf method
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level} ${meta.error?.stack || message}`
  )
);

// Request Logger equipped with two transports:
//   Console - logs to Terminal
//   File - logs to a file called request.log
// each transport accepts a format option
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "requests.log",
      format: winston.format.json(),
    }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
   /*  new winston.transports.Console({
      format: messageFormat,
    }), */
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(),
    }),
  ],
});

module.exports = { requestLogger, errorLogger };