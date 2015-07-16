'use strict';

var validateMoment = function (date) {
  if (!date) {
    throw new Error('Invalid date');
  }

  if (!date.isValid || !date.isValid()) {
    throw new Error('Invalid date');
  }

  return date;
};

var validators = {
  start: validateMoment,
  interval: function validateInterval(value) {
    if (typeof value !== 'object') {
      throw new Error('Invalid interval');
    }

    return value;
  },
  end: validateMoment
};

/**
 * Period
 * @param {moment} start Start date
 * @param {moment.duration} interval Interval representing the duration of an iteration
 * @param {number|moment} end Either the number of recurrences or the end date
 * @return {Period}
 */
var Period = module.exports = function Period(start, interval, end) {
  if (typeof start === 'string' && start[0] === 'R') {
    var moment = require('moment');

    var iso = start.split(/\//);

    start = moment(iso[1]);
    interval = moment.duration(iso[2]);
    end = parseInt(iso[0].substr(1), 10);
  }

  start = validators.start(start).clone();
  this.interval = validators.interval(interval);

  if (typeof end === 'number') {
    var rec = end;
    end = start.clone();
    for (var i = 0; i < rec; i++) {
      end.add(this.interval);
    }

    end.add(this.interval); // includes end in results
  } else {
    end = validators.end(end);

    if (start.isAfter(end)) {
      throw new Error('Invalid period');
    }
  }

  this.length = 0;

  while (end.isAfter(start)) {
    this[this.length++] = start.clone();
    start.add(this.interval);
  }
};

Period.prototype.toString = function toString() {
  return 'R' + (this.length - 1) + '/' + this[0].format() + '/' + this.interval.toISOString();
};
