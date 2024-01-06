const { checkArtistName } = require("../../helpers/artistEndpointHelpers.js");

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