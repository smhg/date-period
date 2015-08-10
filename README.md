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

period = Period(start, 'P1D', end);

// or, with the number of recurrences instead of an end date:
period = Period(start, 'P1D', 3);

// or, with a string formatted as an ISO 8601 repeating interval:
period = Period('R3/2014-01-01T00:00:00Z/P1D');

// in any case, period is an iterable object:
for (let date of period) {
	//...
}
```
> **Note:** the date and duration parameters can be objects which have, respectively, `toDate` and `toString` methods. This way [moment](http://momentjs.com) objects are supported.

The `period` variable in the example above also has a `toArray()` method for use with ES5:
```javascript
period.toArray().forEach(function (date) {
	//...
});
```
