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

        it('should include end date as last item', function () {
            var period = new Period(start, moment.duration(1, 'day'), end);
            assert.deepEqual(period[period.length - 1].toDate(), end.toDate());
          });

        it('should handle not-matching start and end dates', function () {
            var period = new Period(start, moment.duration(1, 'day'), start.clone().add(7, 'days').subtract(12, 'hours'));
            assert.equal(period.length, 7, 'shortened end should affect length');

            period = new Period(start, moment.duration(1, 'day'), start.clone().add(7, 'days').add(12, 'hours'));
            assert.equal(period.length, 8, 'stretched end should not affect length');
          });
      });

    describe('#toString()', function () {
        it('should return a string', function () {
            var start = moment(),
              end = start.clone().add(7, 'days'),
              period = new Period(start, moment.duration(1, 'day'), end);

            assert.equal(typeof period.toString(), 'string');
          });
      });
  });
