import logger from'./logger.js';

const NODE_ENV = process.env.NODE_ENV;

function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    logger.error(error.message)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
}

export default errorHandler
