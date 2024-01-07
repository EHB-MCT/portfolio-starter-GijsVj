const { checkArtworkLocation } = require("../../helpers/artworkEndpointHelpers.js");
/**
 * Artwork Image URL Validation
 *
 * Validates artwork image URLs using the checkArtworkImage function.
 *
 * @route Artwork Image URL Validation
 * @group Testing
 * @param {string} imageUrl - The artwork URL to be validated.
 * @name ArtworkImageURLValidation
 * @function
 */
describe('Artwork Location Geohash Validation', () => {
  test('Valid geohash should return true', () => {
    const validGeohash = "u4pruydqqvj";
    expect(checkArtworkLocation(validGeohash)).toBe(true);
  });

  test('Invalid geohash should return false', () => {
    const invalidGeohash = "invalid-location";
    expect(checkArtworkLocation(invalidGeohash)).toBe(false);
  });

  test('Minimum length geohash should return false', () => {
    const minGeohash = "a";
    expect(checkArtworkLocation(minGeohash)).toBe(false);
  });

  test('Geohash exceeding maximum length should return false', () => {
    // Assuming a maximum length of 20 characters
    const longGeohash = "a".repeat(21);
    expect(checkArtworkLocation(longGeohash)).toBe(false);
  });

  test('Empty geohash should return false', () => {
    const emptyGeohash = "";
    expect(checkArtworkLocation(emptyGeohash)).toBe(false);
  });

  test('Null geohash should return false', () => {
    const nullGeohash = null;
    expect(checkArtworkLocation(nullGeohash)).toBe(false);
  });

  test('Non-string geohash should return false', () => {
    const nonStringGeohash = 1;
    expect(checkArtworkLocation(nonStringGeohash)).toBe(false);
  });

  test('False geohash should return false', () => {
    const falseGeohash = false;
    expect(checkArtworkLocation(falseGeohash)).toBe(false);
  });

  test('Undefined geohash should return false', () => {
    const undefinedGeohash = undefined;
    expect(checkArtworkLocation(undefinedGeohash)).toBe(false);
  });

  test('Geohash with capital letters should return false', () => {
    const capitalGeohash = "u4pruYdQqVJ";
    expect(checkArtworkLocation(capitalGeohash)).toBe(false);
  });
});