'use strict';

let toInt = (str) => {
  return parseInt(str || '0', 10);
};

export default (isoString) => {
  let sequence = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

  let [, ...parts] = isoString.match(sequence),
    [year, month, day, hour, minute, second] = parts.map(toInt);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    toString() {
      return 'P' +
        (year ? year + 'Y' : '') +
        (month ? month + 'M' : '') +
        (day ? day + 'D' : '') +
        (hour || minute || second ?
          'T' +
          (hour ? hour + 'H' : '') +
          (minute ? minute + 'M' : '') +
          (second ? second + 'S' : '') +
        '' : '');
    }
  };
};
