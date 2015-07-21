'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var toInt = function toInt(str) {
  return parseInt(str || '0', 10);
};

var _default = (function () {
  function _default(isoString) {
    _classCallCheck(this, _default);

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

    Object.assign(this, {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second
    });
  }

  _createClass(_default, [{
    key: 'toString',
    value: function toString() {
      return 'P' + (this.year ? this.year + 'Y' : '') + (this.month ? this.month + 'M' : '') + (this.day ? this.day + 'D' : '') + (this.hour || this.minute || this.second ? 'T' + (this.hour ? this.hour + 'H' : '') + (this.minute ? this.minute + 'M' : '') + (this.second ? this.second + 'S' : '') + '' : '');
    }
  }]);

  return _default;
})();

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=duration.js.map