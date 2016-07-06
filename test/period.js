'use strict';

import assert from 'assert';
import createPeriod from '../dist/period';

describe('Period', () => {
  let start, end, duration;

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
        createPeriod({start: '2013-12-01'});
      });

      assert.throws(() => {
        createPeriod({start});
      });

      assert.throws(() => {
        createPeriod({start, duration: 'abc'});
      });

      assert.throws(() => {
        createPeriod({start, duration});
      });

      assert.throws(() => {
        createPeriod({start, duration, recurrence: 'abc'});
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
      let period = createPeriod({start, duration, end}),
        last;

      assert.deepEqual(period[Symbol.iterator]().next().value, start);

      for (last of period);
      last.setUTCDate(last.getUTCDate() + 1); // end is not included
      assert.deepEqual(last, end);

      period = createPeriod({start, duration, recurrence: 7});

      assert.deepEqual(period[Symbol.iterator]().next().value, start);

      for (last of period);
      assert.deepEqual(last, end);
    });

    it('should handle DST', () => {
      let period = createPeriod({start: new Date('Mon Oct 24 2016 00:00:00 GMT+0200 (CEST)'), duration: 'P1W', recurrence: 1}),
        iterator = period[Symbol.iterator]();

      iterator.next();

      assert.deepEqual(new Date('Mon Oct 31 2016 00:00:00 GMT+0100 (CET)'), iterator.next().value);

      period = createPeriod({start: new Date('Sun Oct 30 2016 02:00:00 GMT+0200 (CEST)'), duration: 'PT1H', recurrence: 1});
      iterator = period[Symbol.iterator]();

      iterator.next();

      assert.deepEqual(new Date('Sun Oct 30 2016 02:00:00 GMT+0100 (CET)'), iterator.next().value);
    });
  });

  describe('#toArray()', () => {
    it('should return generated result', () => {
      let start = new Date('2013-06-30T12:30:00Z'),
        arr = createPeriod({start, duration, recurrence: 7}).toArray();

      assert.ok(Array.isArray(arr));
      assert.equal(arr.length, 8);
      assert.doesNotThrow(function () {
        Array.prototype.forEach.call(arr, () => {});
      });
    });

    it('should not include end date as last item', () => {
      let period = createPeriod({start, duration, end}).toArray(),
        testEnd = new Date(+start);

      testEnd.setDate(testEnd.getDate() + 6);

      assert.deepEqual(period[period.length - 1], testEnd);
    });

    it('should handle not-matching start and end dates', () => {
      let thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() - 12);

      let arr = createPeriod({start, duration, end: thisEnd}).toArray();

      assert.equal(arr.length, 7, 'shortened end should affect length');

      thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() + 12);

      arr = createPeriod({start, duration, end: thisEnd}).toArray();
      assert.equal(arr.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', () => {
      assert.throws(() => {
        createPeriod({iso: 'abc'});
      });

      let arr = createPeriod({iso: 'R4/2015-09-10T00:00:00Z/PT1H'}).toArray();

      assert.equal(5, arr.length);
      assert.deepEqual(new Date('2015-09-10T00:00:00Z'), arr[0]);
      assert.deepEqual(new Date('2015-09-10T04:00:00Z'), arr[4]);
    });

    it('should handle date-like objects with a toDate method', () => {
      class CustomDate { // something like moment
        constructor(date) { this.date = date; }
        toDate() { return this.date; }
      }

      let dummy = new CustomDate(start),
        arr = createPeriod({start: dummy, duration: 'PT1H30M', recurrence: 3}).toArray();

      assert(arr.length === 4);
      assert.deepEqual(arr[0], start);
    });

    it('should handle duration objects with a toString method', () => {
      class CustomDuration { // something like moment.duration
        constructor(isoString) { this.isoString = isoString; }
        toString() { return this.isoString; }
      }

      let dummy = new CustomDuration('P1D'),
        arr = createPeriod({start, duration: dummy, recurrence: 3}).toArray();

      assert(arr.length === 4);
      assert.deepEqual(arr[0], start);
    });
  });

  describe('#toString()', () => {
    it('should return a string', () => {
      let start = new Date('2013-06-30T12:30:00Z'),
        str = createPeriod({start, duration, recurrence: 7}).toString();

      assert.equal(typeof str, 'string');
      assert.equal(str, 'R7/2013-06-30T12:30:00.000Z/P1D');
    });
  });
});
