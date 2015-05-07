period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period)
======
JavaScript date period "iterator".

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Usage
#### new Period(start, interval, end)
#### new Period(start, interval, recurrences)
#### new Period(isoString)
```javascript
var start = moment.utc('2014-01-01T00:00:00Z'),
	end = start.clone().add(4, 'days'), // end date itself won't be included
	period = new Period(start, moment.duration(1, 'day'), end);

// or, with the number of recurrences instead of an end date:
period = new Period(start, moment.duration(1, 'day'), 3);

// or, with a string in ISO 8601 repeating interval format:
period = new Period('R3/2014-01-01T00:00:00Z/P1D');

/**
 * in any case, period is an array-like object:
 * {
 *   0: moment.utc('2014-01-01T00:00:00Z'),
 *   1: moment.utc('2014-01-02T00:00:00Z'),
 *   2: moment.utc('2014-01-03T00:00:00Z'),
 *   3: moment.utc('2014-01-04T00:00:00Z'),
 *   length: 4
 * }
 */
```
The `period` variable in the example can, for instance, be iterated like:
```javascript
Array.prototype.forEach.call(period, function (date) {
	//...
});
```
or with [underscore](http://underscorejs.org)'s or [lodash](http://lodash.com)'s `_.each`.
