/**
 * Check the validity of the artist artwork_count.
 * @param {string} artwork_count - Artist artwork_count to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtistArtcount(artwork_count) {
    // Check if the artwork_count is null or undefined
    if (artwork_count == null) {
        return false;
    }

    // Check if the artwork_count is not a string
    if (typeof artwork_count !== "string") {
        return false;
    }

    // Check if the location geohash length exceeds a maximum length (adjust the maximum length as needed)
    if (artwork_count.length > 255) {
        return false;
    }

    // Check if the artwork_count contains only letters and spaces using a regular expression
    const artwork_countRegex = /^[0-9]+$/;
    if (!artwork_countRegex.test(artwork_count)) {
        return false;
    }

    // If all conditions pass, consider it a valid artist artwork_count
    return true;
}

module.exports = {
    checkArtistArtcount
};