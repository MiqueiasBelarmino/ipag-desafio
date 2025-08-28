const { createLogger, format, transports } = require('winston');

const customFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  return JSON.stringify({
    level,
    message,
    timestamp,
    ...meta
  });
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
