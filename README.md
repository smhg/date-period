date-period [![Build status](https://api.travis-ci.org/smhg/date-period.png)](https://travis-ci.org/smhg/date-period)
======
Time period iterator.

A time period in this context is an array of Date objects, recurring at regular intervals, over a given period. Based on ISO 8601's [duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) and [repeating interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals) format.

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

## Installation
```bash
$ npm install date-period --save
```

## Use

### API

#### Start, duration and end date: 

`createPeriod({ start: Date, duration: String, end: Date }) ⇒ Array<Date>`

#### Start, duration, and number of recurrences:

`createPeriod({ start: Date, duration: String, recurrence: Number }) ⇒ Array<Date>`

#### ISO 8601 Repeating time intervals:

`createPeriod({ iso: String }) ⇒ Array<Date>`

The date and duration parameters can be objects which have, respectively, `toDate` and `toString` methods. This way [moment](http://momentjs.com) objects are supported.

### Example

Require the module

```javascript
const createPeriod = require('date-period');
```

#### Define a period

```javascript
let start = new Date('2014-01-01T00:00:00Z'),
	duration = 'P1D',
	end = new Date('2014-01-05T00:00:00Z'), // not included in result
	period;

period = createPeriod({ start, duration, end });

// or, with the number of recurrences instead of an end date:
period = createPeriod({ start, duration, recurrence: 3 });

// or, with a string formatted as an ISO 8601 repeating interval:
period = createPeriod({ iso: 'R3/2014-01-01T00:00:00Z/P1D' });
```
