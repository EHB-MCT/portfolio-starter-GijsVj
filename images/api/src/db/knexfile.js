/**
 * Knex Configuration for Development Environment
 *
 * Configures the Knex.js library for the development environment, specifying the PostgreSQL database connection
 * details, migration settings, and other related configurations.
 *
 * @module knexConfig
 * @exports {Object} Configuration object for the development environment.
 * @property {Object} development - Development environment configuration.
 * @property {string} development.client - Database client (in this case, 'pg' for PostgreSQL).
 * @property {string} development.connection - PostgreSQL connection string, defaults to a local test database.
 * @property {Object} development.migrations - Configuration for database migrations.
 * @property {string} development.migrations.tableName - Name of the migrations table in the database.
 * @property {string} development.migrations.directory - Directory path for storing migration files.
 */
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING || 'postgres://test:test@127.0.0.1:5432/test',
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
