const { checkArtistName } = require("../../helpers/artistEndpointHelpers.js");
/**
 * Check Artist Name
 *
 * Validates the provided artist name to ensure it meets certain criteria.
 * The function checks for empty, null, short, numeric, boolean, and undefined names.
 * It also checks for names exceeding a character limit and containing invalid characters.
 *
 * @route POST /checkArtistName
 * @param {string} artistName - The artist name to be validated.
 * @returns {boolean} - Returns true if the artist name is valid; otherwise, false.
 * @name CheckArtistName
 * @function
 */
describe('checkArtistName', () => {
  test('should return false for an empty name', () => {
    expect(checkArtistName("")).toBe(false);
  });

  test('should return false for a null name', () => {
    expect(checkArtistName(null)).toBe(false);
  });

  test('should return false for a short name', () => {
    expect(checkArtistName("i")).toBe(false);
  });

  test('should return false for a numeric name', () => {
    expect(checkArtistName(1)).toBe(false);
  });

  test('should return false for a number in string', () => {
    expect(checkArtistName("1")).toBe(false);
  });

  test('should return false for a boolean name', () => {
    expect(checkArtistName(false)).toBe(false);
  });

  test('should return false for an undefined name', () => {
    expect(checkArtistName(undefined)).toBe(false);
  });

  test('should return false for a long name exceeding the character limit', () => {
    const longName = "fdfgsrgsdhdshsergskflghsldghsghsd;gjslfgdsfhlghsdsdjhfgsghdkfghdfkgjhsfkghfgjhkfhgkfghfghksfhdskjshdg";
    expect(checkArtistName(longName)).toBe(false);
  });

  test('should return false for a name containing invalid characters', () => {
    expect(checkArtistName("Bobby@")).toBe(false);
  });

  test('should return true for valid names', () => {
    expect(checkArtistName("Updated Leonardo da Vinci")).toBe(true);
    expect(checkArtistName("Vincent van Gogh")).toBe(true);
  });
});