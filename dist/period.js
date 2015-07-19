'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var validateMoment = function validateMoment(date) {
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
  interval: function interval(value) {
    if (typeof value !== 'object') {
      throw new Error('Invalid interval');
    }

    return value;
  },
  end: validateMoment
};

/**
 * Period class.
 */

var Period = (function () {
  /**
   * @param {date|string} start - Start date or ISO 8601 repeating interval.
   * @param {string} duration - ISO 8601 duration.
   * @param {date|number} end - End date or number of recurrences.
   */

  function Period(start, interval, end) {
    _classCallCheck(this, Period);

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
  }

  _createClass(Period, [{
    key: 'toString',

    /**
     * @return {string}
     */
    value: function toString() {
      return 'R' + (this.length - 1) + '/' + this[0].format() + '/' + this.interval.toISOString();
    }
  }]);

  return Period;
})();

exports['default'] = Period;
module.exports = exports['default'];