const { checkArtistBirthyear } = require("../../helpers/artistBirthyearEndpointHelpers.js");

test('valid artist birthyear', () => {
    expect(checkArtistBirthyear(1990)).toBe(true);
  });

  test('invalid artist birthyear - null', () => {
    expect(checkArtistBirthyear(null)).toBe(false);
  });

  test('invalid artist birthyear - undefined', () => {
    expect(checkArtistBirthyear(undefined)).toBe(false);
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
    expect(checkArtistBirthyear('abcd')).toBe(false);
  });

  test('invalid artist birthyear - float', () => {
    expect(checkArtistBirthyear(1990.5)).toBe(false);
  });

  test('invalid artist birthyear - negative', () => {
    expect(checkArtistBirthyear(-1990)).toBe(false);
  });