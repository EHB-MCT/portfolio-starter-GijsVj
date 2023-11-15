// migrations/<timestamp>_create_artworks.js
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
  
  exports.down = function (knex) {
    return knex.schema.table('artworks', function (table) {
      table.dropColumn('artist_uuid');
    });
  };