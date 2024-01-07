/**
 * Check the validity of the artist's artwork count.
 * @param {number} artworkCount - Artist's artwork count to be validated.
 * @returns {boolean} True if valid, false otherwise.
 */
function checkArtistArtcount(artworkCount) {
    // Check if the artworkCount is null or undefined
    if (artworkCount == null) {
        return false;
    }

    // Check if the artworkCount is numeric
    if (typeof artworkCount !== 'number' || isNaN(artworkCount)) {
        return false;
    }

    // Convert the numeric artworkCount to a string for further checks
    const artworkCountStr = artworkCount.toString();

    // Check if the artworkCount length is within the valid range
    if (artworkCountStr.length === 0 || artworkCountStr.length > 6) {
        return false;
    }

    // Check if the artworkCount contains only digits using a regular expression
    const artworkCountRegex = /^\d+$/;
    if (!artworkCountRegex.test(artworkCountStr)) {
        return false;
    }

    // If all conditions pass, consider it a valid artist's artwork count
    return true;
}

/**
 * Check the validity of the artist birth year.
 * @param {number} birthyear - Artist birth year to be validated.
 * @returns {boolean} True if valid, false otherwise.
 */
function checkArtistBirthyear(birthyear) {
    if (birthyear == null || typeof birthyear !== 'number') {
        return false;
    }

    const birthyearStr = birthyear.toString();

    if (birthyearStr.length <= 1 || birthyearStr.length > 4 || !/^\d+$/.test(birthyearStr)) {
        return false;
    }

    return true;
}

/**
 * Check the validity of the artist name.
 * @param {string} name - Artist name to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtistName(name) {
    const MIN_NAME_LENGTH = 2;
    const MAX_NAME_LENGTH = 50;

    // Check if the name is null, undefined, or not a string
    if (name == null || typeof name !== "string") {
        return false;
    }

    // Check if the name length is within the acceptable range
    if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
        return false;
    }

    // Check if the name contains only letters and spaces using a regular expression
    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(name)) {
        return false;
    }

    // If all conditions pass, consider it a valid artist name
    return true;
}

module.exports = {
    checkArtistArtcount,
    checkArtistBirthyear,
    checkArtistName
};