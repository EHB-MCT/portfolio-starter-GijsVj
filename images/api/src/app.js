const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./db/knexfile');

const app = express();
app.use(bodyParser.json());

// Initialize Knex with the development configuration
const db = knex(knexConfig.development);

// Import routes
const artworkRoutes = require('./routes/artworks.js');
app.use('/artworks', artworkRoutes);

const artistRoutes = require('./routes/artists.js');
app.use('/artists', artistRoutes);

module.exports = app;