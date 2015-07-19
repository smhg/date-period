'use strict';

import parseIsoDuration from '../src/parse-iso-duration';
import assert from 'assert';

describe('parseIsoDuration', () => {
  it('should parse date part', () => {
    let duration = parseIsoDuration('P1Y2M3D');

    assert.equal(duration.year, 1);
    assert.equal(duration.month, 2);
    assert.equal(duration.day, 3);
  });

  it('should parse time part', () => {
    let duration = parseIsoDuration('PT1H2M3S');

    assert.equal(duration.hour, 1);
    assert.equal(duration.minute, 2);
    assert.equal(duration.second, 3);
  });

  it('should parse date and time part', () => {
    let duration = parseIsoDuration('P1Y2M3DT4H5M6S');

    assert.equal(duration.year, 1);
    assert.equal(duration.month, 2);
    assert.equal(duration.day, 3);
    assert.equal(duration.hour, 4);
    assert.equal(duration.minute, 5);
    assert.equal(duration.second, 6);
  });

  it('should skip missing parts', () => {
    let duration = parseIsoDuration('P1MT2S');

    assert.equal(duration.month, 1);
    assert.equal(duration.second, 2);
  });
});
