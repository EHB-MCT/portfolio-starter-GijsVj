/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
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
  
  exports.down = function (knex) {
    return knex.schema.dropTable('artists');
  };
