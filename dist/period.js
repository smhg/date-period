'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPeriod;

var _dateDuration = require('date-duration');

var _dateDuration2 = _interopRequireDefault(_dateDuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

require('babel-polyfill');

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

  if ((typeof duration === 'undefined' ? 'undefined' : _typeof(duration)) === 'object' && typeof duration.toString === 'function') {
    duration = duration.toString();
  }

  if (typeof duration !== 'string' || duration[0] !== 'P') {
    throw new Error('Invalid duration');
  }

  duration = (0, _dateDuration2.default)(duration);

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

  var period = (_period = {}, _defineProperty(_period, Symbol.iterator, regeneratorRuntime.mark(function _callee() {
    var date, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            date = new Date(+start);

            if (!end) {
              _context.next = 10;
              break;
            }

          case 2:
            if (!(date < end)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return new Date(+date);

          case 5:
            date = duration.addTo(date);
            _context.next = 2;
            break;

          case 8:
            _context.next = 18;
            break;

          case 10:
            i = 0;

          case 11:
            if (!(i <= recurrence)) {
              _context.next = 18;
              break;
            }

            _context.next = 14;
            return new Date(+date);

          case 14:
            date = duration.addTo(date);

          case 15:
            i++;
            _context.next = 11;
            break;

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })), _defineProperty(_period, 'toArray', function toArray() {
    return Array.from(period);
  }), _defineProperty(_period, 'toString', function toString() {
    var result = period.toArray();

    return 'R' + (result.length - 1) + '/' + start.toISOString() + '/' + duration;
  }), _period);

  return Object.freeze(period);
}
//# sourceMappingURL=period.js.map