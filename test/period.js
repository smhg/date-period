'use strict';

import assert from 'assert';
import createPeriod from '../src/period';

describe('Period', () => {
  let start;
  let end;
  let duration;

  beforeEach(() => {
    start = new Date();
    duration = 'P1D';
    end = new Date(+start);
    end.setDate(end.getDate() + 7);
  });

  describe('#()', () => {
    it('should require parameters', () => {
      assert.throws(() => {
        createPeriod();
      });
    });

    it('should validate parameters', () => {
      assert.throws(() => {
        createPeriod({ start: '2013-12-01' });
      });

      assert.throws(() => {
        createPeriod({ start });
      });

      assert.throws(() => {
        createPeriod({ start, duration: 'abc' });
      });

      assert.throws(() => {
        createPeriod({ start, duration });
      });

      assert.throws(() => {
        // we can't have infinite loops
        Array.from(createPeriod({ start, duration: 'P0D', end }));
      });

      assert.throws(() => {
        createPeriod({ start, duration, recurrence: 'abc' });
      });

      assert.throws(() => {
        createPeriod({
          start: new Date('2013-12-01T00:00:00Z'),
          duration,
          end: new Date('2013-11-01T00:00:00Z')
        });
      });
    });

    it('should be iterable', () => {
      let period = createPeriod({ start, duration, end });
      let last;

      assert.deepStrictEqual(period[Symbol.iterator]().next().value, start);

      for (last of period);
      last.setUTCDate(last.getUTCDate() + 1); // end is not included
      assert.deepStrictEqual(last, end);

      period = createPeriod({ start, duration, recurrence: 7 });

      assert.deepStrictEqual(period[Symbol.iterator]().next().value, start);

      for (last of period);
      assert.deepStrictEqual(last, end);
    });

    it('should handle DST', () => {
      let period = createPeriod({
        start: new Date('Mon Oct 24 2016 00:00:00 GMT+0200 (CEST)'),
        duration: 'P1W',
        recurrence: 1
      });
      let iterator = period[Symbol.iterator]();

      iterator.next();

      assert.deepStrictEqual(
        new Date('Mon Oct 31 2016 00:00:00 GMT+0100 (CET)'),
        iterator.next().value
      );

      // date-duration ignores timezone differences when adding time units
      period = createPeriod({
        start: new Date('Sun Oct 30 2016 02:00:00 GMT+0200 (CEST)'),
        duration: 'PT2H',
        recurrence: 1
      });
      iterator = period[Symbol.iterator]();

      iterator.next();

      assert.deepStrictEqual(
        new Date('Sun Oct 30 2016 03:00:00 GMT+0100 (CET)'),
        iterator.next().value
      );
    });
  });

  describe('#toArray()', () => {
    it('should return generated result', () => {
      const start = new Date('2013-06-30T12:30:00Z');
      const arr = createPeriod({ start, duration, recurrence: 7 }).toArray();

      assert.ok(Array.isArray(arr));
      assert.strictEqual(arr.length, 8);
      assert.doesNotThrow(function () {
        Array.prototype.forEach.call(arr, () => {});
      });
    });

    it('should not include end date as last item', () => {
      const period = createPeriod({ start, duration, end }).toArray();
      const testEnd = new Date(+start);

      testEnd.setDate(testEnd.getDate() + 6);

      assert.deepStrictEqual(period[period.length - 1], testEnd);
    });

    it('should handle not-matching start and end dates', () => {
      let thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() - 12);

      let arr = createPeriod({ start, duration, end: thisEnd }).toArray();

      assert.strictEqual(arr.length, 7, 'shortened end should affect length');

      thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() + 12);

      arr = createPeriod({ start, duration, end: thisEnd }).toArray();
      assert.strictEqual(arr.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', () => {
      assert.throws(() => {
        createPeriod({ iso: 'abc' });
      });

      const arr = createPeriod({ iso: 'R4/2015-09-10T00:00:00Z/PT1H' }).toArray();

      assert.strictEqual(5, arr.length);
      assert.deepStrictEqual(new Date('2015-09-10T00:00:00Z'), arr[0]);
      assert.deepStrictEqual(new Date('2015-09-10T04:00:00Z'), arr[4]);
    });

    it('should handle date-like objects with a toDate method', () => {
      class CustomDate { // something like moment
        constructor (date) { this.date = date; }
        toDate () { return this.date; }
      }

      const dummy = new CustomDate(start);
      const arr = createPeriod({
        start: dummy,
        duration: 'PT1H30M',
        recurrence: 3
      }).toArray();

      assert(arr.length === 4);
      assert.deepStrictEqual(arr[0], start);
    });

    it('should handle duration objects with a toString method', () => {
      class CustomDuration { // something like moment.duration
        constructor (isoString) { this.isoString = isoString; }
        toString () { return this.isoString; }
      }

      const dummy = new CustomDuration('P1D');
      const arr = createPeriod({ start, duration: dummy, recurrence: 3 }).toArray();

      assert(arr.length === 4);
      assert.deepStrictEqual(arr[0], start);
    });
  });

  describe('#toString()', () => {
    it('should return a string', () => {
      const start = new Date('2013-06-30T12:30:00Z');
      const str = createPeriod({ start, duration, recurrence: 7 }).toString();

      assert.strictEqual(typeof str, 'string');
      assert.strictEqual(str, 'R7/2013-06-30T12:30:00.000Z/P1D');
    });
  });
});
