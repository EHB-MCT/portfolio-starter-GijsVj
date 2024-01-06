const { checkArtistArtcount } = require("../../helpers/artistEndpointHelpers.js");

describe('checkArtistArtcount function', () => {
  test('valid artist artwork count (1990)', () => {
    expect(checkArtistArtcount(1990)).toBe(true);
  });

  test('valid artist artwork count (6)', () => {
    expect(checkArtistArtcount(6)).toBe(true);
  });

  test('invalid artist artwork count - null', () => {
    expect(checkArtistArtcount(null)).toBe(false);
  });

  test('invalid artist artwork count - undefined', () => {
    expect(checkArtistArtcount(undefined)).toBe(false);
  });

  test('invalid artist artwork count - non-numeric', () => {
    expect(checkArtistArtcount('25')).toBe(false);
  });

  test('invalid artist artwork count - long length', () => {
    expect(checkArtistArtcount(1356214)).toBe(false);
  });

  test('invalid artist artwork count - non-digit characters', () => {
    expect(checkArtistArtcount('abcd')).toBe(false);
  });

  test('invalid artist artwork count - float', () => {
    expect(checkArtistArtcount(1250.5)).toBe(false);
  });

  test('invalid artist artwork count - negative', () => {
    expect(checkArtistArtcount(-325)).toBe(false);
  });
});