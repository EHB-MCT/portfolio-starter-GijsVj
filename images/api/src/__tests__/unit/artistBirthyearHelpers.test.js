const { checkArtistBirthyear } = require("../../helpers/artistEndpointHelpers.js");
/**
 * Check Artist Birthyear
 *
 * Validates whether the provided artist birthyear is valid or not.
 *
 * @route POST /checkArtistBirthyear
 * @param {number} birthyear - The birthyear of the artist to be validated.
 * @returns {boolean} 200 - True if the birthyear is valid; otherwise, false.
 * @returns {Object} 400 - An error object if the birthyear is invalid.
 * @name CheckArtistBirthyear
 * @function
 */
describe('checkArtistBirthyear', () => {
  test('valid artist birthyear', () => {
    expect(checkArtistBirthyear(1990)).toBe(true);
  });

  test('invalid artist birthyear - null', () => {
    expect(checkArtistBirthyear(null)).toBe(false);
  });

  test('invalid artist birthyear - undefined', () => {
    expect(checkArtistBirthyear(undefined)).toBe(false);
  });

  test('invalid artist birthyear - boolean', () => {
    expect(checkArtistBirthyear(true)).toBe(false);
  });

  test('invalid artist birthyear - non-numeric', () => {
    expect(checkArtistBirthyear('1990')).toBe(false);
  });

  test('invalid artist birthyear - short length', () => {
    expect(checkArtistBirthyear(1)).toBe(false);
  });

  test('invalid artist birthyear - long length', () => {
    expect(checkArtistBirthyear(12345)).toBe(false);
  });

  test('invalid artist birthyear - non-digit characters', () => {
    expect(checkArtistBirthyear('ab#&')).toBe(false);
  });

  test('invalid artist birthyear - float', () => {
    expect(checkArtistBirthyear(1990.5)).toBe(false);
  });

  test('invalid artist birthyear - negative', () => {
    expect(checkArtistBirthyear(-1990)).toBe(false);
  });
});