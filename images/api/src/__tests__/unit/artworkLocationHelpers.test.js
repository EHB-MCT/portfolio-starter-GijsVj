const { checkArtworkLocation } = require("../../helpers/artworkLocationEndpointHelpers.js");

// Test for a valid location geohash
test('check valid location geohash', () => {
    const validGeohash = "u4pruydqqvj";
    expect(checkArtworkLocation(validGeohash)).toBe(true);
});

// Test for an invalid location geohash
test('check invalid location geohash', () => {
    const invalidGeohash = "invalid-location";
    expect(checkArtworkLocation(invalidGeohash)).toBe(false);
});

// Test for minimum length location geohash
test('check minimum length location geohash', () => {
    const minGeohash = "a";
    expect(checkArtworkLocation(minGeohash)).toBe(false);
});

// Test for maximum length + 1 location geohash
test('check maximum length + 1 location geohash', () => {
    // Assuming a maximum length of 20 characters
    const longGeohash = "a".repeat(21);
    expect(checkArtworkLocation(longGeohash)).toBe(false);
});

// Test for empty string location geohash
test('check empty string location geohash', () => {
    const emptyGeohash = "";
    expect(checkArtworkLocation(emptyGeohash)).toBe(false);
});

// Test for null location geohash
test('check null location geohash', () => {
    const nullGeohash = null;
    expect(checkArtworkLocation(nullGeohash)).toBe(false);
});

// Test for non-string input
test('check non-string location geohash', () => {
    const nonStringGeohash = 1;
    expect(checkArtworkLocation(nonStringGeohash)).toBe(false);
});

// Test for false input
test('check false location geohash', () => {
    const falseGeohash = false;
    expect(checkArtworkLocation(falseGeohash)).toBe(false);
});

// Test for undefined input
test('check undefined location geohash', () => {
    const undefinedGeohash = undefined;
    expect(checkArtworkLocation(undefinedGeohash)).toBe(false);
});

// Test for geohash with capital letters
test('check geohash with capital letters', () => {
    const capitalGeohash = "u4pruYdQqVJ";
    expect(checkArtworkLocation(capitalGeohash)).toBe(false);
});