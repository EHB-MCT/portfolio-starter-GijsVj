const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize Knex with the development configuration
const db = knex(knexConfig.development);

// Define CRUD routes for artworks
// Create an artwork
app.post('/artworks', (req, res) => {
  const { title, artist_uuid, image_url, location_geohash } = req.body;

  db('artworks')
    .insert({ title, artist_uuid, image_url, location_geohash })
    .then(() => res.status(201).json({ message: 'Artwork created successfully' }))
    .catch((error) => res.status(500).json({ error }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});