const { checkArtworkTitle } = require("../../helpers/artworkTitleEndpointHelpers.js");

// Test for an empty title
test('check empty title', () => {
    expect(checkArtworkTitle("")).toBe(false);
});

// Test for a null title
test('check null title', () => {
    expect(checkArtworkTitle(null)).toBe(false);
});

// Test for a short title
test('check short title', () => {
    expect(checkArtworkTitle("i")).toBe(false);
});

// Test for a numeric title
test('check numeric title', () => {
    expect(checkArtworkTitle(1)).toBe(false);
});

// Test for a boolean title
test('check boolean title', () => {
    expect(checkArtworkTitle(false)).toBe(false);
});

// Test for an undefined title
test('check undefined title', () => {
    expect(checkArtworkTitle(undefined)).toBe(false);
});

// Test for a long title exceeding the character limit
test('check long title exceeding limit', () => {
    expect(checkArtworkTitle("fdfgsrgsdhdshsergskflghsldghsghsd;gjslfgdsfhlghsdsdjhfgsghdkfghdfkgjhsfkghfgjhkfhgkfghfghksfhdskjshdg")).toBe(false);
});

// Test for a title containing invalid characters
test('check title with invalid characters', () => {
    expect(checkArtworkTitle("Starry skies@")).toBe(false);
});

// Test for valid titles
test('check valid titles', () => {
    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("de schreeuw")).toBe(true);
});