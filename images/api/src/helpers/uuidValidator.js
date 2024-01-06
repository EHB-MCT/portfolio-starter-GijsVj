/**
 * Small function that tests for a valid uuid structure
 * @param {*} uuidStr 
 * @returns 
 */
function isValidUUID(uuidStr) {
  const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return UUID_PATTERN.test(uuidStr);
}

module.exports = { isValidUUID };