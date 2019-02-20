'use strict';

import createDuration from 'date-duration';
import createDebug from 'debug';

const debug = createDebug('date-period');

const filterDate = date => {
  if (typeof date.toDate === 'function') {
    date = date.toDate();
  }

  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Invalid date');
  }

  return new Date(+date);
};

const addDuration = (date, duration) => {
  const result = duration.addTo(date);

  if (+date === +result) {
    throw new Error(`Invalid period (invalid duration '${duration}')`);
  }

  return result;
};

/**
 * constructor
 * @param  {Date} options.start Start date
 * @param  {Object|string} options.duration Duration
 * @param  {Date} options.end End date
 * @param  {number} options.recurrence Recurrences
 * @param  {string} options.iso Duration in ISO 8601 format
 * @return {Object} Period
 */
function createPeriod ({ start, duration, end, recurrence, iso }) {
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
  } else if (typeof recurrence !== 'undefined') {
    if (typeof recurrence !== 'number') {
      throw new Error('Invalid period (invalid number of recurrences)');
    }
  } else {
    throw new Error('Invalid period (missing end or number of recurrences)');
  }

  if (end && start >= end) {
    throw new Error('Invalid period (end needs to be after start)');
  }

  let period = {
    * [Symbol.iterator] () {
      let date = new Date(+start);

      if (end) {
        while (date < end) {
          debug(`hit ${date}`);
          yield date;

          date = addDuration(date, duration);
        }
      } else {
        debug(`hit ${date}`);
        yield date;

        for (let i = 0; i < recurrence; i++) {
          date = addDuration(date, duration);

          debug(`hit ${date}`);
          yield date;
        }
      }
    },
    toArray: () => Array.from(period),
    toString: () => `R${period.toArray().length - 1}/${start.toISOString()}/${duration}`
  };

  return Object.freeze(period);
}

export default createPeriod;
