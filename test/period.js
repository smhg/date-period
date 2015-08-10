'use strict';

import assert from 'assert';
import createPeriod from '../src/period';

describe('Period', () => {
  describe('#()', () => {
    let start, end;

    beforeEach(() => {
      start = new Date();
      end = new Date(+start);
      end.setDate(end.getDate() + 7);
    });

    it('should require parameters', () => {
      assert.throws(() => { createPeriod(); }, 'constructor should expect parameters');
    });

    it('should validate parameters', () => {
      assert.throws(() => { createPeriod('2013-12-01'); }, 'constructor should not allow invalid parameters');
    });

    it('should be iterable', () => {
      let period = createPeriod(start, 'P1D', 7).toArray();

      assert.deepEqual(period[0], start);
      assert.equal(period.length, 8);

      assert.doesNotThrow(function () {
        Array.prototype.forEach.call(period, () => {});
      });
    });

    it('should not include end date as last item', () => {
      let period = createPeriod(start, 'P1D', end).toArray(),
        testEnd = new Date(+start);

      testEnd.setDate(testEnd.getDate() + 6);

      assert.deepEqual(period[period.length - 1], testEnd);
    });

    it('should handle not-matching start and end dates', () => {
      let thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() - 12);

      let period = createPeriod(start, 'P1D', thisEnd).toArray();

      assert.equal(period.length, 7, 'shortened end should affect length');

      thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() + 12);

      period = createPeriod(start, 'P1D', thisEnd).toArray();
      assert.equal(period.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', () => {
      let period = createPeriod('R4/2015-10-25T00:00:00Z/PT1H').toArray();

      assert.equal(5, period.length);
      assert.deepEqual(new Date('2015-10-25T00:00:00Z'), period[0]);
      assert.deepEqual(new Date('2015-10-25T04:00:00Z'), period[4]);

      period = createPeriod('R4/2015-10-25T00:00:00Z/P1M').toArray();
      assert.deepEqual(new Date('2015-10-25T00:00:00Z'), period[0]);
      assert.deepEqual(new Date('2015-11-25T00:00:00Z'), period[1]);
    });

    it('should handle date-like objects with a toDate method', () => {
      class CustomDate { // something like moment
        constructor(date) { this.date = date; }
        toDate() { return this.date; }
      }

      let dummy = new CustomDate(start),
        period = createPeriod(dummy, 'PT1H30M', 3).toArray();

      assert(period.length === 4);
      assert.deepEqual(period[0], start);
    });

    it('should handle duration objects with a toString method', () => {
      class CustomDuration { // something like moment.duration
        constructor(isoString) { this.isoString = isoString; }
        toString() { return this.isoString; }
      }

      let dummy = new CustomDuration('P1D'),
        period = createPeriod(start, dummy, 3).toArray();

      assert(period.length === 4);
      assert.deepEqual(period[0], start);
    });
  });

  describe('#toString()', () => {
    it('should return a string', () => {
      let start = new Date('2013-06-30T12:30:00Z'),
        str = createPeriod(start, 'P1D', 7).toString();

      assert.equal(typeof str, 'string');
      assert.equal(str, 'R7/2013-06-30T12:30:00.000Z/P1D');
    });
  });
});
