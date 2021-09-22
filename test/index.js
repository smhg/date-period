import assert from 'assert';
import createPeriod from '../index.js';

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

      assert.deepStrictEqual(period[0], start);

      last = period[period.length - 1];
      last.setUTCDate(last.getUTCDate() + 1); // end is not included
      assert.deepStrictEqual(last, end);

      period = createPeriod({ start, duration, recurrence: 7 });

      assert.deepStrictEqual(period[0], start);

      last = period[period.length - 1];
      assert.deepStrictEqual(last, end);
    });

    it('should handle DST', () => {
      let period = createPeriod({
        start: new Date('Mon Oct 24 2016 00:00:00 GMT+0200 (CEST)'),
        duration: 'P1W',
        recurrence: 1
      });

      assert.deepStrictEqual(
        new Date('Mon Oct 31 2016 00:00:00 GMT+0100 (CET)'),
        period[1]
      );

      // date-duration ignores timezone differences when adding time units
      period = createPeriod({
        start: new Date('Sun Oct 30 2016 02:00:00 GMT+0200 (CEST)'),
        duration: 'PT2H',
        recurrence: 1
      });

      assert.deepStrictEqual(
        new Date('Sun Oct 30 2016 03:00:00 GMT+0100 (CET)'),
        period[1]
      );
    });

    it('should return generated result', () => {
      const start = new Date('2013-06-30T12:30:00Z');
      const period = createPeriod({ start, duration, recurrence: 7 });

      assert.ok(Array.isArray(period));
      assert.strictEqual(period.length, 8);
      assert.doesNotThrow(function () {
        Array.prototype.forEach.call(period, () => {});
      });
    });

    it('should not include end date as last item', () => {
      const period = createPeriod({ start, duration, end });
      const testEnd = new Date(+start);

      testEnd.setDate(testEnd.getDate() + 6);

      assert.deepStrictEqual(period[period.length - 1], testEnd);
    });

    it('should handle not-matching start and end dates', () => {
      let thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() - 12);

      let period = createPeriod({ start, duration, end: thisEnd });

      assert.strictEqual(period.length, 7, 'shortened end should affect length');

      thisEnd = new Date(+start);
      thisEnd.setDate(thisEnd.getDate() + 7);
      thisEnd.setHours(thisEnd.getHours() + 12);

      period = createPeriod({ start, duration, end: thisEnd });
      assert.strictEqual(period.length, 8, 'stretched end should not affect length');
    });

    it('should parse a string in ISO format', () => {
      assert.throws(() => {
        createPeriod({ iso: 'abc' });
      });

      const period = createPeriod({ iso: 'R4/2015-09-10T00:00:00Z/PT1H' });

      assert.strictEqual(5, period.length);
      assert.deepStrictEqual(new Date('2015-09-10T00:00:00Z'), period[0]);
      assert.deepStrictEqual(new Date('2015-09-10T04:00:00Z'), period[4]);
    });

    it('should handle date-like objects with a toDate method', () => {
      class CustomDate { // something like moment
        constructor (date) { this.date = date; }
        toDate () { return this.date; }
      }

      const dummy = new CustomDate(start);
      const period = createPeriod({
        start: dummy,
        duration: 'PT1H30M',
        recurrence: 3
      });

      assert(period.length === 4);
      assert.deepStrictEqual(period[0], start);
    });

    it('should handle duration objects with a toString method', () => {
      class CustomDuration { // something like moment.duration
        constructor (isoString) { this.isoString = isoString; }
        toString () { return this.isoString; }
      }

      const dummy = new CustomDuration('P1D');
      const period = createPeriod({ start, duration: dummy, recurrence: 3 });

      assert(period.length === 4);
      assert.deepStrictEqual(period[0], start);
    });
  });
});
