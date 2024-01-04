/**
 * Check the validity of the artwork title.
 * @param {string} title - Artwork title to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkTitle(title) {
    // Check if the title is null or undefined
    if (title == null) {
        return false;
    }

    // Check if the title is not a string
    if (typeof title !== "string") {
        return false;
    }

    // Check if the title length is less than or equal to 1
    if (title.length <= 1) {
        return false;
    }

    // Check if the title length exceeds a maximum length (adjust the maximum length as needed)
    if (title.length >= 20) {
        // Adjust the maximum length as per your requirements
        return false;
    }

    // Check if the title contains only alphanumeric characters and spaces using a regular expression
    const titleRegex = /^[a-zA-Z0-9 ]+$/;
    if (!titleRegex.test(title)) {
        return false;
    }

    // If all conditions pass, consider it a valid artwork title
    return true;
}

module.exports = {
    checkArtworkTitle
};