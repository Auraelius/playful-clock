import logger from './logger.js';

const API_TOKEN = process.env.API_TOKEN;

// todo replace this with something that is a tiny both more secure
// this just expects a certain string in the authorization header


function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  logger.error(`Unauthorized request to path: ${req.path}`)

  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  next()
}

export default validateBearerToken
