const { checkArtworkTitle } = require("../../helpers/artworkEndpointHelpers.js");
/**
 * Check Artwork Title Validity
 *
 * Validates the provided artwork title based on specific criteria.
 *
 * @route POST /validateTitle
 * @param {string} title - The title to be validated.
 * @returns {boolean} - Returns true if the title is valid, otherwise false.
 * @name CheckArtworkTitle
 * @function
 */
describe('Artwork Title Validation', () => {
  test('should return false for empty title', () => {
    expect(checkArtworkTitle("")).toBe(false);
  });

  test('should return false for null title', () => {
    expect(checkArtworkTitle(null)).toBe(false);
  });

  test('should return false for short title', () => {
    expect(checkArtworkTitle("i")).toBe(false);
  });

  test('should return false for numeric title', () => {
    expect(checkArtworkTitle(1)).toBe(false);
  });

  test('should return false for boolean title', () => {
    expect(checkArtworkTitle(false)).toBe(false);
  });

  test('should return false for undefined title', () => {
    expect(checkArtworkTitle(undefined)).toBe(false);
  });

  test('should return false for long title exceeding limit', () => {
    const longTitle = "fdfgsrgsdhdshsergskflghsldghsghsd;gjslfgdsfhlghsdsdjhfgsghdkfghdfkgjhsfkghfgjhkfhgkfghfghksfhdskjshdg";
    expect(checkArtworkTitle(longTitle)).toBe(false);
  });

  test('should return false for title with invalid characters', () => {
    expect(checkArtworkTitle("Starry skies@")).toBe(false);
  });

  test('should return true for valid titles', () => {
    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("de schreeuw")).toBe(true);
  });
});