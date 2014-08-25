[![browser support](https://ci.testling.com/smhg/date-period.png)](https://ci.testling.com/smhg/date-period)

period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period)
======
JavaScript date period "iterator".

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Usage
### new Period(start, interval, end|recurrences)
```javascript
var start = moment('2014-01-01 00:00:00'),
	end = start.clone().add(3, 'days'),
	period = new Period(start, moment.duration(1, 'day'), end);

// or, with the number of recurrences instead of an end date:
// period = new Period(start, moment.duration(1, 'day'), 3);

/**
 * period is now an array-like object:
 * {
 *   0: moment('2014-01-01 00:00:00'),
 *   1: moment('2014-01-02 00:00:00'),
 *   2: moment('2014-01-03 00:00:00'),
 *   3: moment('2014-01-04 00:00:00'),
 *   length: 4
 * }
 */

// or, with a string in ISO 8601 repeating interval format:
// period = new Period('R4/2012-07-01T00:00:00Z/P7D');
```
The `period` variable in the example can, for instance, be iterated like:
```javascript
Array.prototype.forEach.call(period, function (date) {
	//...
});
```
or with [underscore](http://underscorejs.org)'s or [lodash](http://lodash.com)'s `_.each`.
