'use strict';

let toInt = (str) => {
  return parseInt(str || '0', 10);
};

export default class {
  constructor(isoString) {
    let sequence = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

    let [, ...parts] = isoString.match(sequence);

    parts = parts.map(toInt);

    this.year = parts[0];
    this.month = parts[1];
    this.day = parts[2];
    this.hour = parts[3];
    this.minute = parts[4];
    this.second = parts[5];
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
