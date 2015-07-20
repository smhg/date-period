'use strict';

let toInt = (str) => {
  return parseInt(str || '0', 10);
};

export default class {
  constructor(isoString) {
    let sequence = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

    let [, ...parts] = isoString.match(sequence),
      [year, month, day, hour, minute, second] = parts.map(toInt);

    Object.assign(this, {
      year,
      month,
      day,
      hour,
      minute,
      second
    });
  }

  toString() {
    return 'P' +
      (this.year ? this.year + 'Y' : '') +
      (this.month ? this.month + 'M' : '') +
      (this.day ? this.day + 'D' : '') +
      (this.hour || this.minute || this.second ?
        'T' +
        (this.hour ? this.hour + 'H' : '') +
        (this.minute ? this.minute + 'M' : '') +
        (this.second ? this.second + 'S' : '') +
      '' : '');
  }
}
