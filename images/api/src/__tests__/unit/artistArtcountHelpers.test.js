const { checkArtistArtcount } = require("../../helpers/artistEndpointHelpers.js");
/**
 * Check Artist Artwork Count
 *
 * Validates the provided artist artwork count to ensure it meets the specified criteria.
 *
 * @param {number} count - The artist's artwork count to be validated.
 * @returns {boolean} - Returns true if the count is valid, and false otherwise.
 * @name checkArtistArtcount
 * @function
 */
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