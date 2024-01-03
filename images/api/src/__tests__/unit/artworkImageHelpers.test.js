const { checkArtworkImage } = require("../../helpers/artworkImageEndpointHelpers.js");

// Test for a specific case (e.g., valid URL)
test('check valid image URL', () => {
    expect(checkArtworkImage("https://example.com/starry-night.jpg")).toBe(true);
});

// Test for an invalid URL
test('check invalid image URL', () => {
    expect(checkArtworkImage("invalid-url")).toBe(false);
});

// Test for an edge case (e.g., minimum length)
test('check minimum length image URL', () => {
    expect(checkArtworkImage("a")).toBe(false);
});

// Test for an edge case (e.g., maximum length)
test('check maximum length image URL', () => {
    // Assuming a maximum length of 255 characters (for example purposes)
    const longUrl = "https://example.com/" + "a".repeat(250) + ".jpg";
    expect(checkArtworkImage(longUrl)).toBe(false);
});

// Test for a empty string
test('check empty strting image URL', () => {
    expect(checkArtworkImage("")).toBe(false);
});

// Test for a null input
test('check null image URL', () => {
    expect(checkArtworkImage(null)).toBe(false);
});

// Test for a string
test('check string image URL', () => {
    expect(checkArtworkImage(1)).toBe(false);
});

// Test for a false
test('check false image URL', () => {
    expect(checkArtworkImage(false)).toBe(false);
});

// Test for an undefined
test('check undefined image URL', () => {
    expect(checkArtworkImage(undefined)).toBe(false);
});