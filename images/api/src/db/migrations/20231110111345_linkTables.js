/**
 * Create Artworks Table Migration
 *
 * This migration script creates a new column 'artist_uuid' in the 'artworks' table,
 * establishing a foreign key relationship with the 'uuid' column in the 'artists' table.
 * The 'CASCADE' option is set for both onUpdate and onDelete, providing referential integrity.
 *
 * @route migrations/<timestamp>_create_artworks.js
 * @function
 *
 * @param {Object} knex - The Knex instance used for database operations.
 * @returns {Promise} A promise representing the completion of the migration.
 * @name CreateArtworksTableMigration
 */
exports.up = function (knex) {
    return knex.schema.table('artworks', function (table) {
      table
        .uuid('artist_uuid')
        .references('uuid')
        .inTable('artists')
        .onUpdate('CASCADE') // Optional: Update the reference if the artist UUID is updated
        .onDelete('CASCADE').alter(); // Optional: Delete artworks if the referenced artist is deleted
    });
  };
  
  /**
 * Rollback Artworks Table Migration
 *
 * This migration script rolls back the changes made by the 'up' function.
 * It removes the 'artist_uuid' column from the 'artworks' table.
 *
 * @route migrations/<timestamp>_create_artworks.js
 * @function
 *
 * @param {Object} knex - The Knex instance used for database operations.
 * @returns {Promise} A promise representing the completion of the rollback.
 * @name RollbackArtworksTableMigration
 */
  
  exports.down = function (knex) {
    return knex.schema.table('artworks', function (table) {
      table.dropColumn('artist_uuid');
    });
  };