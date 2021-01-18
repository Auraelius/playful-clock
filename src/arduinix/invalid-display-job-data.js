import logger from '../logger.js'

export function invalidDisplayJobData(data) {
  /*
    if it has keys `digits` and `brightness`
    and those keys have string values
    and those strings are the same length as the number of tubes
    and the chars in the digits are 0-9 or b or ' '
    and the chars in the brightness are 0-9
    then return false
    else return true
    todo check to make sure t is valid
  */
  let t;
  if (process.env.NUMBER_OF_TUBES){
    t = parseInt(process.env.NUMBER_OF_TUBES,10)
  } else {
    logger.error(`invalidDisplayJobData: process.env.NUMBER_OF_TUBES: ${process.env.NUMBER_OF_TUBES} - setting number of tubes to 8`);
    t=8;
  }
  logger.info(`invalidDisplayJobData: data: ${JSON.stringify(data)}`)
  
  const validDigits = new RegExp(`[0-9|b| ]{${t}}`);
  const validBrightness = new RegExp(`[0-9]{${t}}`);

  if (data===undefined) {
    logger.error(`invalidDisplayJobData: data undefined`);
    return true;}
  if (!data.hasOwnProperty('digits')) {
    logger.error(`invalidDisplayJobData: data missing 'digits' property`);
    return true;}
  if (!data.hasOwnProperty('brightness')) {
    logger.error(`invalidDisplayJobData: data missing 'brightness' property`);
    return true;}
  if (isNotString(data.digits)) {
    logger.error(`invalidDisplayJobData: data.digits not a string`);
    return true;}
  if (isNotString(data.brightness)) {
    logger.error(`invalidDisplayJobData: data.brightness not a string`);
    return true;}
  if (data.digits.length !== t) {
    logger.error(`invalidDisplayJobData: data.digits length = ${data.digits.length} does not match number of tubes = ${t}`);
    return true;}
  if (data.brightness.length !== t) {
    logger.error(`invalidDisplayJobData: data.brightness length = ${data.brightness.length} does not match number of tubes = ${t}`);
    return true;}
  if (!validDigits.test(data.digits)) {
    logger.error(`invalidDisplayJobData: data.digits = ${data.digits} is invalid`);
    return true;}
  if (!validBrightness.test(data.brightness)) {
    logger.error(`invalidDisplayJobData: data.brightness = ${data.brightness} is invalid`);
    return true;}
  return false;
}

function isNotString(obj) {
  return !(Object.prototype.toString.call(obj) === '[object String]');
}
