const { checkArtistArtcount } = require("../../helpers/artistArtcountEndpointHelpers.js");

// Test for an empty artwork_count
test('check empty artwork_count', () => {
    expect(checkArtistArtcount("")).toBe(false);
});

// Test for a null artwork_count
test('check null artwork_count', () => {
    expect(checkArtistArtcount(null)).toBe(false);
});

// Test for a numeric artwork_count
test('check numeric artwork_count', () => {
    expect(checkArtistArtcount(1)).toBe(false);
});

// Test for a boolean artwork_count
test('check boolean artwork_count', () => {
    expect(checkArtistArtcount(false)).toBe(false);
});

// Test for an undefined artwork_count
test('check undefined artwork_count', () => {
    expect(checkArtistArtcount(undefined)).toBe(false);
});

// Test for maximum length + 1 location geohash
test('check maximum length + 1 location geohash', () => {
    // Assuming a maximum length of 20 characters
    const longGeohash = "2".repeat(256);
    expect(checkArtistArtcount(longGeohash)).toBe(false);
});

// Test for a artwork_count containing invalid characters
test('check artwork_count with invalid characters', () => {
    expect(checkArtistArtcount("Ae8&")).toBe(false);
});

// Test for valid artwork_counts
test('check valid artwork_counts', () => {
    expect(checkArtistArtcount("6")).toBe(true);
    expect(checkArtistArtcount("56245")).toBe(true);
});