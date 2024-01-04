/**
 * Check the validity of the artist name.
 * @param {string} name - Artist name to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtistName(name) {
    // Check if the name is null or undefined
    if (name == null) {
        return false;
    }

    // Check if the name is not a string
    if (typeof name !== "string") {
        return false;
    }

    // Check if the name length is less than or equal to 1
    if (name.length <= 1) {
        return false;
    }

    // Check if the name length exceeds a maximum length (adjust the maximum length as needed)
    if (name.length >= 20) {
        // Adjust the maximum length as per your requirements
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
    checkArtistName
};