// const debug = require('debug')('app:service:profile:regexService');

const validChars = '[0-9A-Za-z]';
const validLeadingChars = '[1-9A-Za-z]';
const singleChar = `(^${validChars}$)|(^-$)`;
const multiChar = `(^${validLeadingChars}${validChars}+$)`;
const singleDot = `(^${validLeadingChars}${validChars}*\\.${validChars}+$)`;
const doubleDot = `(^${validLeadingChars}${validChars}*\\.${validChars}+\\.${validChars}+$)`;
const draftVersionValidationPattern = `${singleChar}|${multiChar}|${singleDot}|${doubleDot}`;
const regex = new RegExp(draftVersionValidationPattern);

export const draftVersionFilter = (x) => {
  // debug('regex = ', regex);
  if (regex.test(x)) {
    return true;
  }
  return false;
};
