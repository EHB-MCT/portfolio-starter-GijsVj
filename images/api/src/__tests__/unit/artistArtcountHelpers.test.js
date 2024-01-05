const { checkArtistArtcount } = require("../../helpers/artistArtcountEndpointHelpers.js");

test('valid artist artwork count', () => {
    expect(checkArtistArtcount(1990)).toBe(true);
  });

  test('valid artist artwork count', () => {
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
    expect(checkArtistArtcount(12345)).toBe(false);
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