function requireMoment (date) {
  if (!date) {
    throw new Error('Invalid date');
  }

  if (!date.isValid || !date.isValid()) {
    throw new Error('Invalid date');
  }

  return date;
}

var validators = {
  start: requireMoment,
  interval: function validateInterval (value) {
    if (typeof value !== 'object') {
      throw new Error('Invalid interval');
    }

    return value;
  },
  end: requireMoment
};

/**
 * Period
 * @param {moment} start Start date
 * @param {moment.duration} interval Interval representing the duration of an iteration
 * @param {number|moment} end Either the number of recurrences or the end date
 * @return {Period}
 */
module.exports = function Period (start, interval, end) {
  start = validators.start(start).clone();
  interval = validators.interval(interval);

  if (typeof end === 'number') {
    var rec = end;
    end = start.clone();
    for (var i = 0;i < rec;i++) {
      end.add(interval);
    }
  } else {
    end = validators.end(end);

    if (start.isAfter(end)) {
      throw new Error('Invalid period');
    }
  }

  this.length = 0;

  while (!start.isAfter(end)) {
    this[this.length++] = start.clone();
    start.add(interval);
  }
};
