var moment = require('moment');

function validateMoment (moment) {
  if (!start) {
    throw new Error('Invalid start');
  }

  if (!moment.isValid(start)) {
    throw new Error('Invalid start');
  }

  return moment;
}

var periodOptions = ['start', 'interval', 'occurences', 'end'],
  validators = {
    start: validateMoment,
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
    end: validateMoment
  };

module.exports = function Period (start, interval) {
  var args = arguments;

  if (start && moment.isValid(start)) {
    this.set('start', start);
  }

  if (interval && typeof interval === 'object') {
    this.set('interval', interval);
  }

  if (args[2]) {
    if (typeof args[2] === 'number') {
      this.set('occurences', args[2]);
    } else {
      this.set('end', args[2]);
    }
  }
};

Period.prototype.set = function (option, value) {
  if (!(option in periodOptions)) {
    throw new Error('Invalid option');
  }

  this[option] = validators[option](value);

  return this;
};
