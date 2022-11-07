const { format, createLogger, transports } = require("winston");

const { combine, timestamp, label, printf } = format;
const CATEGORY = "coe_challenge";

//Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [
    new transports.File({
      filename: "logger/logs/debug.txt",
    }),
    new transports.File({
        level: "error",
        filename: "logger/logs/error.txt",
      }),
  ]
});

module.exports = logger;