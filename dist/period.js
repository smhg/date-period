'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Object$freeze = require('babel-runtime/core-js/object/freeze')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createPeriod;

var _dateDuration = require('date-duration');

var _dateDuration2 = _interopRequireDefault(_dateDuration);

var filterDate = function filterDate(date) {
  if (typeof date.toDate === 'function') {
    date = date.toDate();
  }

  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Invalid date');
  }

  return new Date(+date);
};

function createPeriod(spec) {
  var _period;

  var start = spec.start;
  var duration = spec.duration;
  var end = spec.end;
  var recurrence = spec.recurrence;

  if (spec.iso) {
    if (typeof spec.iso !== 'string' || spec.iso[0] !== 'R') {
      throw new Error('Invalid ISO interval');
    }

    var iso = spec.iso.split(/\//);

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

  duration = (0, _dateDuration2['default'])(duration);

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

  var period = (_period = {}, _defineProperty(_period, _Symbol$iterator, _regeneratorRuntime.mark(function callee$1$0() {
    var date, i;
    return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          date = new Date(+start);

          if (!end) {
            context$2$0.next = 10;
            break;
          }

        case 2:
          if (!(date < end)) {
            context$2$0.next = 8;
            break;
          }

          context$2$0.next = 5;
          return new Date(+date);

        case 5:
          date = duration.addTo(date);
          context$2$0.next = 2;
          break;

        case 8:
          context$2$0.next = 18;
          break;

        case 10:
          i = 0;

        case 11:
          if (!(i <= recurrence)) {
            context$2$0.next = 18;
            break;
          }

          context$2$0.next = 14;
          return new Date(+date);

        case 14:
          date = duration.addTo(date);

        case 15:
          i++;
          context$2$0.next = 11;
          break;

        case 18:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  })), _defineProperty(_period, 'toArray', function toArray() {
    return _Array$from(period);
  }), _defineProperty(_period, 'toString', function toString() {
    var result = period.toArray();

    return 'R' + (result.length - 1) + '/' + start.toISOString() + '/' + duration;
  }), _period);

  return _Object$freeze(period);
}

module.exports = exports['default'];
//# sourceMappingURL=period.js.map