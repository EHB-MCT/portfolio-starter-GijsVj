const { checkArtworkImage } = require("../../helpers/artworkEndpointHelpers.js");

describe('Artwork Image URL Validation', () => {
  test('valid URL', () => {
    const validUrl = "https://example.com/starry-night.jpg";
    expect(checkArtworkImage(validUrl)).toBe(true);
  });

  test('invalid URL', () => {
    const invalidUrl = "invalid-url";
    expect(checkArtworkImage(invalidUrl)).toBe(false);
  });

  test('minimum length URL', () => {
    const minUrl = "a";
    expect(checkArtworkImage(minUrl)).toBe(false);
  });

  test('maximum length URL', () => {
    // Assuming a maximum length of 255 characters (for example purposes)
    const longUrl = "https://example.com/" + "a".repeat(250) + ".jpg";
    expect(checkArtworkImage(longUrl)).toBe(false);
  });

  test('empty string URL', () => {
    const emptyUrl = "";
    expect(checkArtworkImage(emptyUrl)).toBe(false);
  });

  test('null URL', () => {
    const nullUrl = null;
    expect(checkArtworkImage(nullUrl)).toBe(false);
  });

  test('non-string URL', () => {
    const nonStringUrl = 1;
    expect(checkArtworkImage(nonStringUrl)).toBe(false);
  });

  test('false URL', () => {
    const falseUrl = false;
    expect(checkArtworkImage(falseUrl)).toBe(false);
  });

  test('undefined URL', () => {
    const undefinedUrl = undefined;
    expect(checkArtworkImage(undefinedUrl)).toBe(false);
  });
});