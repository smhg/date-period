'use strict';

import assert from 'assert';
import Period from '../src/period';

describe('Period', () => {
  describe('#()', () => {
    let start, end;

    beforeEach(() => {
      start = new Date();
      end = new Date(+start);
      end.setDate(end.getDate() + 7);
    });

    it('should require parameters', () => {
      assert.throws(() => { new Period(); }, 'constructor should expect parameters');
    });

    it('should validate parameters', () => {
      assert.throws(() => { new Period('2013-12-01'); }, 'constructor should not allow invalid parameters');
    });

    it('should be iterable', () => {
      let period = new Period(start, 'P1D', 7);

      assert.deepEqual(period[0], start);
      assert.equal(period.length, 8);

      assert.doesNotThrow(function () {
        Array.prototype.forEach.call(period, () => {});
      });
    });

    it('should not include end date as last item', () => {
      let period = new Period(start, 'P1D', end),
        testEnd = new Date(+start);

      testEnd.setDate(testEnd.getDate() + 6);

      assert.deepEqual(period[period.length - 1], testEnd);
    });

    it('should handle not-matching start and end dates', () => {
      let thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() - 12);

      let period = new Period(start, 'P1D', thisEnd);

      assert.equal(period.length, 7, 'shortened end should affect length');

      thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() + 12);

      period = new Period(start, 'P1D', thisEnd);
      assert.equal(period.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', () => {
      let period = new Period('R4/2015-10-25T00:00:00Z/PT1H');

      assert.equal(5, period.length);
      assert.deepEqual(new Date('2015-10-25T00:00:00Z'), period[0]);
      assert.deepEqual(new Date('2015-10-25T04:00:00Z'), period[4]);

      period = new Period('R4/2015-10-25T00:00:00Z/P1M');
      assert.deepEqual(new Date('2015-10-25T00:00:00Z'), period[0]);
      assert.deepEqual(new Date('2015-11-25T00:00:00Z'), period[1]);
    });

    it('should handle date-like objects with a toDate method', () => {
      class CustomDate { // something like moment
        constructor(date) { this.date = date; }
        toDate() { return this.date; }
      }

      let dummy = new CustomDate(start),
        period = new Period(dummy, 'PT1H30M', 3);

      assert(period.length === 4);
      assert.deepEqual(period[0], start);
    });

    it('should handle duration objects with a toString method', () => {
      class CustomDuration { // something like moment.duration
        constructor(isoString) { this.isoString = isoString; }
        toString() { return this.isoString; }
      }

      let dummy = new CustomDuration('P1D'),
        period = new Period(start, dummy, 3);

      assert(period.length === 4);
      assert.deepEqual(period[0], start);
    });
  });

  describe('#toString()', () => {
    it('should return a string', () => {
      let start = new Date('2013-06-30T12:30:00Z'),
        period = new Period(start, 'P1D', 7),
        str = period.toString();

      assert.equal(typeof str, 'string');
      assert.equal(str, 'R7/2013-06-30T12:30:00Z/P1D');
    });
  });
});
