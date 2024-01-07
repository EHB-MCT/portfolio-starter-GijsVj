const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./db/knexfile');

const app = express();
app.use(bodyParser.json());

// Initialize Knex with the development configuration
const db = knex(knexConfig.development);

/**
 * @module ArtworkRoutes
 * @description This module configures routes for handling artworks and artists in the application.
 *              It imports route handlers for artworks and artists, assigns appropriate base paths,
 *              and exports the configured Express application.
 */

// Import routes
const artworkRoutes = require('./routes/artworks');
const artistRoutes = require('./routes/artists');

// Use routes with appropriate base paths
app.use('/artworks', artworkRoutes);
app.use('/artists', artistRoutes);

module.exports = app;