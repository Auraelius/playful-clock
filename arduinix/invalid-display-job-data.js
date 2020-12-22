export function invalidDisplayJobData(data) {
  /*
    if it has keys `digits` and `brightness`
    and those keys have string values
    and those strings are the same length as the number of tubes
    and the chars in the digits are 0-9 or b or ' '
    and the chars in the brightness are 0-9
    then return false
    else return true
  */
  let t = process.env.NUMBER_OF_TUBES;
  const validDigits = new RegExp(`[0-9|b| ]{${t}}`);
  const validBrightness = new RegExp(`[0-9]{${t}}`);

  if (data===undefined) return true;
  if (!data.hasOwnProperty('digits')) return true;
  if (!data.hasOwnProperty('brightness')) return true;
  if (isNotString(data.digits)) return true;
  if (isNotString(data.brightness)) return true;
  if (data.digits.length !== process.env.NUMBER_OF_TUBES) return true;
  if (data.brightness.length !== process.env.NUMBER_OF_TUBES) return true;
  if (!validDigits.test(data.digits)) return true;
  if (!validBrightness.test(data.brightness)) return true;
  return false;
}

function isNotString(obj) {
  return !(Object.prototype.toString.call(obj) === '[object String]');
}
