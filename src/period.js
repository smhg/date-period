'use strict';

import Duration from './duration';

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

let dateMethods = new Map([
    ['year', 'FullYear'],
    ['month', 'Month'],
    ['day', 'Date'],
    ['hour', 'Hours'],
    ['minute', 'Minutes'],
    ['second', 'Seconds']
  ]),
  add = (date, duration) => {
    for (let [key, methodName] of dateMethods) {
      if (duration[key]) {
        date['set' + methodName](date['get' + methodName]() + duration[key]);
      }
    }
  };

/**
 * Period class.
 */
export default class Period {
  /**
   * @param {date|string} start - Start date or ISO 8601 repeating interval.
   * @param {string} duration - ISO 8601 duration.
   * @param {date|number} end - End date or number of recurrences.
   */
  constructor(start, duration, end) {
    this.length = 0;

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

    this.duration = duration = new Duration(duration);

    try {
      end = filters.date(end);
    } catch (endException) {
      try {
        end = filters.number(end);

        let rec = end;
        end = new Date(+start);
        for (let i = 0; i < rec; i++) {
          add(end, duration);
        }

        add(end, duration); // includes end in results
      } catch (recurrenceException) {
        throw new Error('Third argument should either be a number or date');
      }
    }

    if (start >= end) {
      throw new Error('Invalid parameters, start needs to be before end');
    }

    let date = new Date(+start);

    while (date < end) {
      this[this.length++] = new Date(+date);
      add(date, duration);
    }
  }

  /**
   * @return {string}
   */
  toString() {
    let recurrence = this.length - 1,
      duration = this.duration;

    let pad = (number) => {
      if (number < 10) {
        return '0' + number;
      }

      return number;
    };

    let start = this[0].getUTCFullYear() +
        '-' + pad(this[0].getUTCMonth() + 1) +
        '-' + pad(this[0].getUTCDate()) +
        'T' + pad(this[0].getUTCHours()) +
        ':' + pad(this[0].getUTCMinutes()) +
        ':' + pad(this[0].getUTCSeconds()) +
        'Z';

    return `R${recurrence}/${start}/${duration}`;
  }
}
