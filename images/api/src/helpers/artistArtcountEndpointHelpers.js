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

    // Check if the artwork_count is numeric
    if (typeof artwork_count !== 'number') {
        return false;
    }

    // Convert the numeric artwork_count to a string for further checks
    artwork_count = artwork_count.toString();

    // Check if the artwork_count length is less than or equal to 1
    if (artwork_count.length <= 0) {
        return false;
    }

    // Check if the artwork_count length exceeds a maximum length (adjust the maximum length as needed)
    if (artwork_count.length > 4) {
        return false;
    }

    // Check if the artwork_count contains only digits using a regular expression
    const artwork_countRegex = /^\d+$/;
    if (!artwork_countRegex.test(artwork_count)) {
        return false;
    }

    // If all conditions pass, consider it a valid artist artwork_count
    return true;
}

module.exports = {
    checkArtistArtcount
};