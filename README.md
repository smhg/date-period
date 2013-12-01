period
======

JavaScript date period iterator.
Usable in browser when using [es5-shim](https://github.com/kriskowal/es5-shim).

# Usage
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

## TODO
* Allow construction based on ISO string
* Remove [moment](http://momentjs.com/) dependency
* Test less standard period setups