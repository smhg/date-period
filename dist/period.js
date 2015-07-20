'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _duration2 = require('./duration');

var _duration3 = _interopRequireDefault(_duration2);

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

var addMap = {
  year: 'FullYear',
  month: 'Month',
  day: 'Date',
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds'
},
    add = function add(date, duration) {
  for (var key in addMap) {
    if (addMap.hasOwnProperty(key)) {
      if (duration[key]) {
        date['set' + addMap[key]](date['get' + addMap[key]]() + duration[key]);
      }
    }
  }
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

    this.duration = duration = new _duration3['default'](duration);

    try {
      end = filters.date(end);
    } catch (endException) {
      try {
        end = filters.number(end);

        var rec = end;
        end = new Date(+start);
        for (var i = 0; i < rec; i++) {
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

    var date = new Date(+start);

    while (date < end) {
      this[this.length++] = new Date(+date);
      add(date, duration);
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