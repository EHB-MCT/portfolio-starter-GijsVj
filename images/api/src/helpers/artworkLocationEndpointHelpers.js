/**
 * Check location geohash of the artwork.
 * @param {string} location - Artwork location geohash. 
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkLocation(location) {
    // Check if the location geohash is null or undefined
    if (location == null || typeof location !== "string") {
        return false;
    }

    // Check if the location geohash length is less than or equal to 0 (assuming empty string is not allowed)
    if (location.length <= 1) {
        return false;
    }

    // Check if the location geohash length exceeds a maximum length (adjust the maximum length as needed)
    if (location.length >= 20) {
        // Adjust the maximum length as per your requirements
        return false;
    }

    // Check if the location geohash is valid using a regular expression
    const geohashRegex = /^[a-z0-9]+$/; // Only allow lowercase alphanumeric characters
    if (!geohashRegex.test(location)) {
        return false;
    }

    // If all conditions pass, consider it a valid location geohash
    return true;
}

module.exports = {
    checkArtworkLocation
};