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
      let period = new Period('R4/2012-07-01T00:00:00Z/P7D');

      assert.equal(5, period.length);
      assert.deepEqual(new Date('2012-07-01T00:00:00Z'), period[0]);
      assert.deepEqual(new Date('2012-07-29T00:00:00Z'), period[4]);
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
