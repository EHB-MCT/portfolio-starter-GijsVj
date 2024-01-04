const { checkArtistBirthyear } = require("../../helpers/artistBirthyearEndpointHelpers.js");

// Test for an empty birthyear
test('check empty birthyear', () => {
    expect(checkArtistBirthyear("")).toBe(false);
});

// Test for a null birthyear
test('check null birthyear', () => {
    expect(checkArtistBirthyear(null)).toBe(false);
});

// Test for a short birthyear
test('check short birthyear', () => {
    expect(checkArtistBirthyear("1")).toBe(false);
});

// Test for a numeric birthyear
test('check numeric birthyear', () => {
    expect(checkArtistBirthyear(1)).toBe(false);
});

// Test for a boolean birthyear
test('check boolean birthyear', () => {
    expect(checkArtistBirthyear(false)).toBe(false);
});

// Test for an undefined birthyear
test('check undefined birthyear', () => {
    expect(checkArtistBirthyear(undefined)).toBe(false);
});

// Test for maximum length + 1 location geohash
test('check maximum length + 1 location geohash', () => {
    // Assuming a maximum length of 20 characters
    const longGeohash = "2".repeat(5);
    expect(checkArtistBirthyear(longGeohash)).toBe(false);
});

// Test for a birthyear containing invalid characters
test('check birthyear with invalid characters', () => {
    expect(checkArtistBirthyear("Ae8&")).toBe(false);
});

// Test for valid birthyears
test('check valid birthyears', () => {
    expect(checkArtistBirthyear("1452")).toBe(true);
    expect(checkArtistBirthyear("1853")).toBe(true);
});