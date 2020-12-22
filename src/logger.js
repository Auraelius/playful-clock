import winston from 'winston';
const NODE_ENV = process.env.NODE_ENV;

// todo add a timestamp to format
// todo add an errors log and a common log
// todo add http reqquest logging to common log
// todo add color to console use

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
})

if (!['production', 'test'].includes(NODE_ENV)) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
