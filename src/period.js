'use strict';

require('babel-polyfill');

import createDuration from 'date-duration';

const filterDate = (date) => {
  if (typeof date.toDate === 'function') {
    date = date.toDate();
  }

  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Invalid date');
  }

  return new Date(+date);
};

export default function createPeriod (spec) {
  let {start, duration, end, recurrence} = spec;

  if (spec.iso) {
    if (typeof spec.iso !== 'string' || spec.iso[0] !== 'R') {
      throw new Error('Invalid ISO interval');
    }

    let iso = spec.iso.split(/\//);

    start = new Date(iso[1]);
    duration = iso[2];
    recurrence = parseInt(iso[0].substr(1), 10);
  }

  start = filterDate(start);

  if (typeof duration === 'object' && typeof duration.toString === 'function') {
    duration = duration.toString();
  }

  if (typeof duration !== 'string' || duration[0] !== 'P') {
    throw new Error('Invalid duration');
  }

  duration = createDuration(duration);

  if (end) {
    end = filterDate(end);
  } else if (recurrence) {
    if (typeof recurrence !== 'number') {
      throw new Error('Invalid number of recurrences');
    }
  } else {
    throw new Error('Invalid parameters, missing end or number of recurrences');
  }

  if (end && start >= end) {
    throw new Error('Invalid parameters, end needs to be after start');
  }

  let period = {
    *[Symbol.iterator] () {
      let date = new Date(+start);

      if (end) {
        while (date < end) {
          yield new Date(+date);
          date = duration.addTo(date);
        }
      } else {
        for (let i = 0; i <= recurrence; i++) {
          yield new Date(+date);
          date = duration.addTo(date);
        }
      }
    },
    toArray: () => {
      return Array.from(period);
    },
    toString: () => {
      let result = period.toArray();

      return `R${result.length - 1}/${start.toISOString()}/${duration}`;
    }
  };

  return Object.freeze(period);
}
