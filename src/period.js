'use strict';

import createDuration from 'date-duration';

const filterDate = date => {
  if (typeof date.toDate === 'function') {
    date = date.toDate();
  }

  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Invalid date');
  }

  return new Date(+date);
};

function createPeriod ({start, duration, end, recurrence, iso}) {
  if (iso) {
    if (typeof iso !== 'string' || iso[0] !== 'R') {
      throw new Error('Invalid period (invalid ISO format)');
    }

    [recurrence, start, duration] = iso.split(/\//);

    start = new Date(start);
    recurrence = parseInt(recurrence.substr(1), 10);
  }

  start = filterDate(start);

  if (typeof duration === 'object' && typeof duration.toString === 'function') {
    duration = duration.toString();
  }

  duration = createDuration(duration);

  if (end) {
    end = filterDate(end);
  } else if (recurrence) {
    if (typeof recurrence !== 'number') {
      throw new Error('Invalid period (invalid number of recurrences)');
    }
  } else {
    throw new Error('Invalid period (missing end or number of recurrences)');
  }

  if (end && start >= end) {
    throw new Error('Invalid period (end needs to be after start)');
  }

  if (+start === +duration.addTo(start)) {
    throw new Error(`Invalid period (no duration)`);
  }

  let period = {
    * [Symbol.iterator] () {
      let date = new Date(+start);
      yield date;

      date = duration.addTo(date);

      if (end) {
        while (date < end) {
          yield date;
          date = duration.addTo(date);
        }
      } else {
        for (let i = 0; i < recurrence; i++) {
          yield date;
          date = duration.addTo(date);
        }
      }
    },
    toArray: () => Array.from(period),
    toString: () => `R${period.toArray().length - 1}/${start.toISOString()}/${duration}`
  };

  return Object.freeze(period);
}

export default createPeriod;
