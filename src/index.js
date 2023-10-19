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

// Read all artworks
app.get('/artworks', (req, res) => {
  db('artworks')
    .select()
    .then((artworks) => res.status(200).json(artworks))
    .catch((error) => res.status(500).json({ error }));
});

// Read artwork by id
app.get('/artworks/:id', (req, res) => {
    db('artworks')
      .where({ id: req.params.id })
      .select()
      .then((artworks) => res.status(200).json(artworks))
      .catch((error) => res.status(500).json({ error }));
  });

  // Update an artwork
app.put('/artworks/:id', (req, res) => {
  const { title, artist_uuid, image_url, location_geohash } = req.body;

  db('artworks')
    .where({ id: req.params.id })
    .update({ title, artist_uuid, image_url, location_geohash })
    .then(() => res.status(200).json({ message: 'Artwork updated successfully' }))
    .catch((error) => res.status(500).json({ error }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});