date-period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period) [![Coverage Status](https://coveralls.io/repos/smhg/date-period/badge.svg?branch=master&service=github)](https://coveralls.io/github/smhg/date-period?branch=master)
======
Time period iterator.

A time period in this context is an iterable collection of Date objects, recurring at regular intervals, over a given period. Based on ISO 8601's [duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) and [repeating interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals) format.

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Usage
> **1.0 API note:** a period instance is now an ES6 iterable (iterate with `for ... of`). In ES5 use-cases, you'll have to call `toArray`, on which you can then use the regular array-methods.

#### Period({start: Date, duration: String, end: Date})
#### Period({start: Date, duration: String, recurrence: Number})
#### Period({iso: String})
```javascript
let start = new Date('2014-01-01T00:00:00Z'),
	duration = 'P1D',
	end = new Date('2014-01-05T00:00:00Z'), // not included in result
	period;

period = Period({start, duration, end});

// or, with the number of recurrences instead of an end date:
period = Period({start, duration, recurrence: 3});

// or, with a string formatted as an ISO 8601 repeating interval:
period = Period({iso: 'R3/2014-01-01T00:00:00Z/P1D'});

// in any case, period is an iterable object:
for (let date of period) {
	/**
	 * will go over these dates:
	 * 2014-01-01T00:00:00Z
	 * 2014-01-02T00:00:00Z
	 * 2014-01-03T00:00:00Z
	 * 2014-01-04T00:00:00Z
	 */
}
```
> **Note:** the date and duration parameters can be objects which have, respectively, `toDate` and `toString` methods. This way [moment](http://momentjs.com) objects are supported.
