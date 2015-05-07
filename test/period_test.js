var assert = require('assert'),
  Period = require('..'),
  moment = require('moment');

describe('Period', function () {
  describe('#()', function () {
    var start, end;

    beforeEach(function () {
      start = moment();
      end = start.clone().add(7, 'days');
    });

    it('should require parameters', function () {
      assert.throws(function () { new Period(); }, 'constructor should expect parameters');
    });

    it('should validate parameters', function () {
      assert.throws(function () { new Period('2013-12-01'); }, 'constructor should not allow invalid parameters');
    });

    it('should be iterable', function () {
      var period = new Period(start, moment.duration(1, 'day'), 7);

      assert.deepEqual(period[0].toDate(), start.toDate());
      assert.equal(period.length, 8);
    });

    it('should not include end date as last item', function () {
      var period = new Period(start, moment.duration(1, 'day'), end);
      assert.deepEqual(period[period.length - 1].toDate(), end.clone().subtract(1, 'day').toDate());
    });

    it('should handle not-matching start and end dates', function () {
      var period = new Period(start, moment.duration(1, 'day'), start.clone().add(7, 'days').subtract(12, 'hours'));
      assert.equal(period.length, 7, 'shortened end should affect length');

      period = new Period(start, moment.duration(1, 'day'), start.clone().add(7, 'days').add(12, 'hours'));
      assert.equal(period.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', function () {
      var period = new Period('R4/2012-07-01T00:00:00Z/P7D');

      assert.equal(5, period.length);
      assert(moment('2012-07-01T00:00:00Z').isSame(period[0]));
      assert(moment('2012-07-29T00:00:00Z').isSame(period[4]));
    });
  });

  describe('#toString()', function () {
    it('should return a string', function () {
      var start = moment.utc('2013-06-30T12:30:00Z'),
        period = new Period(start, moment.duration(1, 'day'), 7),
        str = period.toString();

      assert.equal(typeof str, 'string');
      assert.equal(str, 'R7/2013-06-30T12:30:00+00:00/P1D');
    });
  });
});
