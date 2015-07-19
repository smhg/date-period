'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var toInt = function toInt(str) {
  return parseInt(str || '0', 10);
};

exports['default'] = function (isoString) {
  var sequence = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

  var _isoString$match = isoString.match(sequence);

  var _isoString$match2 = _toArray(_isoString$match);

  var parts = _isoString$match2.slice(1);

  var _parts$map = parts.map(toInt);

  var _parts$map2 = _slicedToArray(_parts$map, 6);

  var year = _parts$map2[0];
  var month = _parts$map2[1];
  var day = _parts$map2[2];
  var hour = _parts$map2[3];
  var minute = _parts$map2[4];
  var second = _parts$map2[5];

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    toString: function toString() {
      return 'P' + (year ? year + 'Y' : '') + (month ? month + 'M' : '') + (day ? day + 'D' : '') + (hour || minute || second ? 'T' + (hour ? hour + 'H' : '') + (minute ? minute + 'M' : '') + (second ? second + 'S' : '') + '' : '');
    }
  };
};

module.exports = exports['default'];