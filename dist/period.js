'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _parseIsoDuration = require('./parse-iso-duration');

var _parseIsoDuration2 = _interopRequireDefault(_parseIsoDuration);

var filters = {
  date: function date(_date) {
    if (typeof _date.toDate === 'function') {
      _date = _date.toDate();
    }

    if (Object.prototype.toString.call(_date) !== '[object Date]') {
      throw new Error('Invalid date');
    }

    return new Date(+_date);
  },
  duration: function duration(_duration) {
    if (typeof _duration === 'object' && typeof _duration.toString === 'function') {
      _duration = _duration.toString();
    }

    if (typeof _duration !== 'string' || _duration[0] !== 'P') {
      throw new Error('Invalid duration');
    }

    return _duration;
  },
  interval: function interval(_interval) {
    if (typeof _interval !== 'string' || _interval[0] !== 'R') {
      throw new Error('Invalid interval');
    }

    return _interval;
  },
  number: function number(_number) {
    if (typeof _number !== 'number') {
      throw new Error('Invalid number');
    }

    return _number;
  }
};

var dateAddDuration = function dateAddDuration(date, duration) {
  if (duration.year) {
    date.setFullYear(date.getFullYear() + duration.year);
  }

  if (duration.month) {
    date.setMonth(date.getMonth() + duration.month);
  }

  if (duration.day) {
    date.setDate(date.getDate() + duration.day);
  }

  if (duration.hour) {
    date.setHours(date.getHours() + duration.hour);
  }

  if (duration.minute) {
    date.setMinutes(date.getMinutes() + duration.minute);
  }

  if (duration.second) {
    date.setSeconds(date.getSeconds() + duration.second);
  }

  return date;
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

  function Period(start, duration, end) {
    _classCallCheck(this, Period);

    this.length = 0;

    try {
      start = filters.date(start);
    } catch (startException) {
      try {
        var interval = filters.interval(start).split(/\//);

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
      throw new Error(duration + ' is not a valid duration');
    }

    this.duration = duration = (0, _parseIsoDuration2['default'])(duration);

    try {
      end = filters.date(end);
    } catch (endException) {
      try {
        end = filters.number(end);

        var rec = end;
        end = new Date(+start);
        for (var i = 0; i < rec; i++) {
          end = dateAddDuration(end, duration);
        }

        end = dateAddDuration(end, duration); // includes end in results
      } catch (recurrenceException) {
        throw new Error('Third argument should either be a number or date');
      }
    }

    if (start >= end) {
      throw new Error('Invalid parameters, start needs to be before end');
    }

    var date = new Date(+start);

    while (date < end) {
      this[this.length++] = new Date(+date);
      date = dateAddDuration(date, duration);
    }
  }

  _createClass(Period, [{
    key: 'toString',

    /**
     * @return {string}
     */
    value: function toString() {
      var recurrence = this.length - 1,
          duration = this.duration;

      var pad = function pad(number) {
        if (number < 10) {
          return '0' + number;
        }

        return number;
      };

      var start = this[0].getUTCFullYear() + '-' + pad(this[0].getUTCMonth() + 1) + '-' + pad(this[0].getUTCDate()) + 'T' + pad(this[0].getUTCHours()) + ':' + pad(this[0].getUTCMinutes()) + ':' + pad(this[0].getUTCSeconds()) + 'Z';

      return 'R' + recurrence + '/' + start + '/' + duration;
    }
  }]);

  return Period;
})();

exports['default'] = Period;
module.exports = exports['default'];