date-period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period)
======
Time period iterator.

A time period in this context is an iterable collection of Date objects, recurring at regular intervals, over a given period. Based on ISO 8601's [duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) and [repeating interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals) format.

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Installation
```bash
$ npm install date-period --save
```

## Use

### API

#### Start, duration and end date: 

`Period({start: Date, duration: String, end: Date}) ⇒ Iterable<Date>`

#### Start, duration, and number of recurrences:

`Period({start: Date, duration: String, recurrence: Number}) ⇒ Iterable<Date>`

#### ISO 8601 Repeating time intervals:

`Period({iso: String}) ⇒ Iterable<Date>`

The date and duration parameters can be objects which have, respectively, `toDate` and `toString` methods. This way [moment](http://momentjs.com) objects are supported.

### Example

Require the module

```javascript
const Period = require('date-period').default
```

#### Define a period

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
```

#### Iteration with ES6 for/of

Period is an interable object.

```javascript
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

#### Iteration as an array (for ES5)

Since version 1.0.0 a period instance is an ES6 iterable. Convert the iterable to an array with `period.toArray()`.

```javascript
period.toArray().forEach(function (period) {
	/**
	 * will go over these dates:
	 * 2014-01-01T00:00:00Z
	 * 2014-01-02T00:00:00Z
	 * 2014-01-03T00:00:00Z
	 * 2014-01-04T00:00:00Z
	 */
})
```

