/**
 * Check the validity of the artist birthyear.
 * @param {string} birthyear - Artist birthyear to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtistBirthyear(birthyear) {
    // Check if the birthyear is null or undefined
    if (birthyear == null) {
        return false;
    }

    // Check if the birthyear is numeric
    if (typeof birthyear !== 'number') {
        return false;
    }

    // Convert the numeric birthyear to a string for further checks
    birthyear = birthyear.toString();

    // Check if the birthyear length is less than or equal to 1
    if (birthyear.length <= 1) {
        return false;
    }

    // Check if the birthyear length exceeds a maximum length (adjust the maximum length as needed)
    if (birthyear.length > 4) {
        return false;
    }

    // Check if the birthyear contains only digits using a regular expression
    const birthyearRegex = /^\d+$/;
    if (!birthyearRegex.test(birthyear)) {
        return false;
    }

    // If all conditions pass, consider it a valid artist birthyear
    return true;
}

module.exports = {
    checkArtistBirthyear
};