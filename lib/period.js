var moment = require('moment');

function requireMoment (date) {
  if (!date) {
    throw new Error('Invalid date');
  }

  if (!moment.isValid(date)) {
    throw new Error('Invalid date');
  }

  return date;
}

var properties = ['start', 'interval', 'occurences', 'end'],
  validators = {
    start: requireMoment,
    interval: function validateInterval (value) {
      if (typeof value !== 'object') {
        throw new Error('Invalid interval');
      }

      return value;
    },
    occurences: function validateOccurences (value) {
      if (typeof value !== 'number') {
        throw new Error('Invalid occurences');
      }

      return value;
    },
    end: requireMoment
  };

/**
 * Period
 * @param {moment} start Start date
 * @param {moment.duration} interval Interval representing the duration of an iteration
 * @param {number|moment} occEnd Either the number of occurences or the end date
 * @return {Period}
 */
var Period = module.exports = function Period (start, interval, occEnd) {
  if (start && moment.isValid(start)) {
    this.set('start', start);
  }

  if (interval && typeof interval === 'object') {
    this.set('interval', interval);
  }

  if (occEnd) {
    if (typeof occEnd === 'number') {
      this.set('occurences', occEnd);
    } else {
      this.set('end', occEnd);
    }
  }
};

/**
 * Setter
 * @param {string} option Property name
 * @param {mixed} value Property value
 * @return {Period}
 */
Period.prototype.set = function (name, value) {
  if (!(name in properties)) {
    throw new Error('Invalid property');
  }

  this[name] = validators[name](value);

  return this;
};
