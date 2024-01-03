/**
 * Check image URL of the artwork.
 * @param {string} image - Artwork image URL.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkImage(image) {
    // Check if the image is null or undefined
    if (image == null) {
        return false;
    }

    // Check if the image is not a string
    if (typeof image !== "string") {
        return false;
    }

    // Check if the image length is less than or equal to 0 (assuming empty string is not allowed)
    if (image.length <= 1) {
        return false;
    }

    // Check if the image length exceeds a maximum length (adjust the maximum length as needed)
    if (image.length >= 255) {
        // Adjust the maximum length as per your requirements
        return false;
    }

    // Check if the image URL is valid using a regular expression
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (!urlRegex.test(image)) {
        return false;
    }

    // If all conditions pass, consider it a valid image URL
    return true;
}

module.exports = {
    checkArtworkImage
};