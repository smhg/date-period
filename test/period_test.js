var Period = require('../lib/period'),
  moment = require('moment');

module.exports = {
  'constructor': function constructor (test) {
    var start = moment(),
      end = start.clone().add(7, 'days'),
      period;

    test.throws(function () { new Period(); }, 'constructor should expect parameters');
    test.throws(function () { new Period('2013-12-01'); }, 'constructor should not allow invalid parameters');

    period = new Period(start, moment.duration(1, 'day'), 7);

    test.deepEqual(period[0], start, 'first item should match start');
    test.equal(period.length, 8, 'length property should match number of occurences (recurrences + 1!)');

    period = new Period(start, moment.duration(1, 'day'), end);

    test.deepEqual(period[period.length - 1], end, 'last item should match end');

    test.done();
  },
  'toString': function toString (test) {
    var start = moment(),
      end = start.clone().add(7, 'days'),
      period = new Period(start, moment.duration(1, 'day'), end);

    test.ok(period.toString().length > 3, 'conversion to string should work');

    test.done();
  }
};
