// knexfile.js

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: '',
      database: 'test',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};