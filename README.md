date-period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period)
======
Time period iterator.

A time period in this context is an iterable collection of Date objects, recurring at regular intervals, over a given period. Based on ISO 8601's [duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) and [repeating interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals) format.

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Usage
#### new Period(start, duration, end)
#### new Period(start, duration, recurrences)
#### new Period(ISOString)
```javascript
let start = new Date('2014-01-01T00:00:00Z'),
	end = new Date(+start),
	period;

end.setUTCDate(end.getUTCDate() + 4); // end date itself won't be included 

period = new Period(start, 'P1D', end);

// or, with the number of recurrences instead of an end date:
period = new Period(start, 'P1D', 3);

// or, with a string formatted as an ISO 8601 repeating interval:
period = new Period('R3/2014-01-01T00:00:00Z/P1D');

/**
 * in any case, period is an array-like object:
 * {
 *   0: Date('2014-01-01T00:00:00Z'),
 *   1: Date('2014-01-02T00:00:00Z'),
 *   2: Date('2014-01-03T00:00:00Z'),
 *   3: Date('2014-01-04T00:00:00Z'),
 *   length: 4
 * }
 */
```
> **Note:** the date and duration parameters can be objects which have, respectively, a `toDate` and `toString` method. This way [moment](http://momentjs.com) objects are supported.

The `period` variable in the example above can be iterated over using `forEach`.
Since it is an object and not an array, forEach can only be used when setting the period as `thisArg` with `call`:
```javascript
Array.prototype.forEach.call(period, function (date) {
	//...
});
```
You can also consider [underscore](http://underscorejs.org)'s or [lodash](http://lodash.com)'s `_.each`.
