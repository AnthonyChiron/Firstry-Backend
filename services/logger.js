const winston = require("winston");
const { combine, timestamp, json, colorize, printf, prettyPrint } =
  winston.format;
require("winston-mongodb");
require("express-async-errors");

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

module.exports.errorLogger = winston.createLogger({
  level: "error",
  format: combine(json(), timestamp(), colorize(), prettyPrint(), logFormat),
  transports: [
    // new winston.transports.MongoDB({
    //   db: "mongodb+srv://admin:1s6PFlJu3RZLK4vf@test.8llgtn5.mongodb.net/firstry",
    //   options: { useUnifiedTopology: true },
    // }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.Console({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/fatalError.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/fatalError.log" }),
  ],
});

module.exports.infoLogger = winston.createLogger({
  level: "info",
  format: combine(json(), timestamp(), colorize(), prettyPrint(), logFormat),
  transports: [
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),
    new winston.transports.Console({
      filename: "logs/info.log",
      level: "info",
    }),
  ],
});

module.exports.httpLogger = winston.createLogger({
  level: "http",
  format: combine(json(), timestamp(), colorize(), prettyPrint(), logFormat),
  transports: [
    new winston.transports.File({ filename: "logs/http.log", level: "http" }),
    new winston.transports.Console({
      filename: "logs/http.log",
      level: "http",
    }),
  ],
});
