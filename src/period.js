'use strict';

import createDuration from 'date-duration';

let filters = {
  date: (date) => {
    if (typeof date.toDate === 'function') {
      date = date.toDate();
    }

    if (Object.prototype.toString.call(date) !== '[object Date]') {
      throw new Error('Invalid date');
    }

    return new Date(+date);
  },
  duration: (duration) => {
    if (typeof duration === 'object' && typeof duration.toString === 'function') {
      duration = duration.toString();
    }

    if (typeof duration !== 'string' || duration[0] !== 'P') {
      throw new Error('Invalid duration');
    }

    return duration;
  },
  interval: (interval) => {
    if (typeof interval !== 'string' || interval[0] !== 'R') {
      throw new Error('Invalid interval');
    }

    return interval;
  },
  number: (number) => {
    if (typeof number !== 'number') {
      throw new Error('Invalid number');
    }

    return number;
  }
};

/**
 * @param {date|string} start - Start date or ISO 8601 repeating interval.
 * @param {string} duration - ISO 8601 duration.
 * @param {date|number} end - End date or number of recurrences.
 */
export default function createPeriod (start, duration, end) {
  let length = 0;

  try {
    start = filters.date(start);
  } catch (startException) {
    try {
      let interval = filters.interval(start).split(/\//);

      start = new Date(interval[1]);
      duration = interval[2];
      end = parseInt(interval[0].substr(1), 10);
    } catch (intervalException) {
      throw new Error('First argument should either be a date or interval');
    }
  }

  try {
    duration = filters.duration(duration);
  } catch (durationException) {
    throw new Error(`${duration} is not a valid duration`);
  }

  duration = createDuration(duration);

  try {
    end = filters.date(end);
  } catch (endException) {
    try {
      end = filters.number(end);

      let rec = end;
      end = new Date(+start);
      for (let i = 0; i < rec; i++) {
        end = duration.addTo(end);
      }

      end = duration.addTo(end); // includes end in results
    } catch (recurrenceException) {
      throw new Error('Third argument should either be a number or date');
    }
  }

  if (start >= end) {
    throw new Error('Invalid parameters, start needs to be before end');
  }

  let date = new Date(+start);

  let period = {
    duration,
    toString: () => {
      let recurrence = length - 1;

      let pad = (number) => {
        if (number < 10) {
          return '0' + number;
        }

        return number;
      };

      let start = period[0].getUTCFullYear() +
          '-' + pad(period[0].getUTCMonth() + 1) +
          '-' + pad(period[0].getUTCDate()) +
          'T' + pad(period[0].getUTCHours()) +
          ':' + pad(period[0].getUTCMinutes()) +
          ':' + pad(period[0].getUTCSeconds()) +
          'Z';

      return `R${recurrence}/${start}/${duration}`;
    }
  };

  while (date < end) {
    period[length++] = new Date(+date);
    date = duration.addTo(date);
  }

  period.length = length;

  return Object.freeze(period);
}
