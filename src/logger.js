import winston from 'winston';
const NODE_ENV = process.env.NODE_ENV;

// this appears to set up an info logger only. what about .error?

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
