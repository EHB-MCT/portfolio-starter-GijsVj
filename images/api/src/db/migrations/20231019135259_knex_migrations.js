/**
 * Create Artworks Table
 *
 * Creates the 'artworks' table in the database with the following columns:
 * - id: Auto-incremented primary key
 * - title: String representing the title of the artwork
 * - artist_uuid: String representing the UUID of the artist
 * - image_url: String representing the URL of the artwork image
 * - location_geohash: String representing the geohash of the artwork location (Not Nullable)
 *
 * @route POST /createArtworksTable
 * @returns {Object} 200 - Success message upon successful table creation.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name CreateArtworksTable
 * @function
 */
exports.up = function (knex) {
    return knex.schema.createTable('artworks', function (table) {
      table.increments('id').primary();
      table.string('title')/* .notNullable() */;
      table.string('artist_uuid')/* .notNullable() */;
      table.string('image_url')/* .notNullable() */;
      table.string('location_geohash').notNullable();
      // Add any other columns as needed
    });
  };
  
  /**
 * Drop Artworks Table
 *
 * Drops the 'artworks' table from the database.
 *
 * @route POST /dropArtworksTable
 * @returns {Object} 200 - Success message upon successful table deletion.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name DropArtworksTable
 * @function
 */
  exports.down = function (knex) {
    return knex.schema.dropTable('artworks');
  };