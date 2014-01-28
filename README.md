[![browser support](https://ci.testling.com/smhg/date-period.png)](http://ci.testling.com/smhg/date-period) [![Build status](https://api.travis-ci.org/smhg/date-period.png)] (https://travis-ci.org/smhg/date-period)

period
======

JavaScript date period iterator.

Mimics PHP's excellent [DatePeriod](http://www.php.net/manual/en/class.dateperiod.php) class.

Note: usable in browser, including IE8 with [es5-shim](https://github.com/kriskowal/es5-shim).

## Usage
```javascript
var start = moment(),
    end = start.clone().add(3, 'days');

var period = new Period(start, moment.duration(1, 'day'), end);

console.log(period);
/**
 * {
 *   0: day1,
 *   1: day2,
 *   2: day3,
 *   length: 3
 * }
 */
```
The `period` variable can, for instance, be used with [underscore](underscorejs.org)'s `_.each`.

### TODO
* Allow construction based on [ISO string](http://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals)
* Remove [moment](http://momentjs.com/) dependency

## License
The MIT License (MIT)

Copyright (c) [Sam Hauglustaine](https://github.com/smhg)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
