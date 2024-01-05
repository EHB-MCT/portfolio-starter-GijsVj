const { checkArtistName } = require("../../helpers/artistNameEndpointHelpers.js");

// Test for an empty name
test('check empty name', () => {
    expect(checkArtistName("")).toBe(false);
});

// Test for a null name
test('check null name', () => {
    expect(checkArtistName(null)).toBe(false);
});

// Test for a short name
test('check short name', () => {
    expect(checkArtistName("i")).toBe(false);
});

// Test for a numeric name
test('check numeric name', () => {
    expect(checkArtistName(1)).toBe(false);
});

// Test for a nummber in string
test('check nummber in string', () => {
    expect(checkArtistName("1")).toBe(false);
});

// Test for a boolean name
test('check boolean name', () => {
    expect(checkArtistName(false)).toBe(false);
});

// Test for an undefined name
test('check undefined name', () => {
    expect(checkArtistName(undefined)).toBe(false);
});

// Test for a long name exceeding the character limit
test('check long name exceeding limit', () => {
    expect(checkArtistName("fdfgsrgsdhdshsergskflghsldghsghsd;gjslfgdsfhlghsdsdjhfgsghdkfghdfkgjhsfkghfgjhkfhgkfghfghksfhdskjshdg")).toBe(false);
});

// Test for a name containing invalid characters
test('check name with invalid characters', () => {
    expect(checkArtistName("Bobby@")).toBe(false);
});

// Test for valid names
test('check valid names', () => {
    expect(checkArtistName("Updated Leonardo da Vinci")).toBe(true);
    expect(checkArtistName("Vincent van Gogh")).toBe(true);
});