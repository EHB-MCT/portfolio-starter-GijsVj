/**
 * @route POST /create-artists-table
 * @param {import("knex").Knex} knex - The Knex instance for interacting with the database.
 * @returns {Promise<void>} 200 - The table creation is successful.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name CreateArtistsTable
 * @function
 */
exports.up = function (knex) {
    return knex.schema.createTable('artists', function (table) {
      table.uuid('uuid').unique().primary();
      table.string('artist');
      table.float('birthyear');
      table.float('artwork_count'); // Assuming this is the amount of artworks
      // Add any other columns as needed
    });
  };
  
  /**
 * @route POST /drop-artists-table
 * @param {import("knex").Knex} knex - The Knex instance for interacting with the database.
 * @returns {Promise<void>} 200 - The table deletion is successful.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name DropArtistsTable
 * @function
 */
  exports.down = function (knex) {
    return knex.schema.dropTable('artists');
  };
