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
 *   '0': day1,
 *   '1': day2,
 *   '2': day3,
 *   length: 3
 * }
 */
```
The `period` variable can, for instance, be used with [underscore](underscorejs.org)'s `_.each`.

### TODO
* Allow construction based on ISO string
* Remove [moment](http://momentjs.com/) dependency
