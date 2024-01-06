/**
 * Check if the given string is a valid image URL for artwork.
 * @param {string} image - Artwork image URL.
 * @returns {boolean} - True if the image URL is valid, false otherwise.
 */
function checkArtworkImage(image) {
    // Check if the image is null, undefined, or not a string
    if (!image || typeof image !== "string") {
        return false;
    }

    // Check if the image length is within a reasonable range
    const maxLength = 255;
    if (image.length <= 1 || image.length >= maxLength) {
        return false;
    }

    // Check if the image URL is valid using a regular expression
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(image);
}

/**
 * Checks the validity of artwork location geohash.
 * @param {string} location - Artwork location geohash.
 * @returns {boolean} - True if valid, false otherwise.
 */
function checkArtworkLocation(location) {
    // Check if the location geohash is null, undefined, or not a string
    if (!location || typeof location !== "string") {
        return false;
    }

    // Check if the location geohash length is within a valid range
    const minLength = 2;
    const maxLength = 20;
    if (location.length < minLength || location.length > maxLength) {
        return false;
    }

    // Check if the location geohash consists of only lowercase alphanumeric characters
    const geohashRegex = /^[a-z0-9]+$/;
    if (!geohashRegex.test(location)) {
        return false;
    }

    // If all conditions pass, consider it a valid location geohash
    return true;
}

/**
 * Check the validity of the artwork title.
 * @param {string} title - Artwork title to be validated.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkTitle(title) {
    // Check if the title is null or undefined
    if (title == null || typeof title !== "string") {
        return false;
    }

    // Check if the title length is within the acceptable range
    const minLength = 2;  // Adjust the minimum length as needed
    const maxLength = 20; // Adjust the maximum length as needed
    if (title.length < minLength || title.length > maxLength) {
        return false;
    }

    // Check if the title contains only alphanumeric characters and spaces using a regular expression
    const titleRegex = /^[a-zA-Z0-9 ]+$/;
    return titleRegex.test(title);
}

module.exports = {
    checkArtworkImage,
    checkArtworkLocation,
    checkArtworkTitle,
};
