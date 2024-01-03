const express = require('express');
const router = express.Router();
const { checkArtworkTitle } = require('../helpers/artworkTitleEndpointHelpers.js');
const { checkArtworkImage } = require('../helpers/artworkImageEndpointHelpers.js');
const { checkArtworkLocation } = require('../helpers/artworkLocationEndpointHelpers.js');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library and use the v4 method

const knexFile = require("../db/knexfile.js");

const db = require('knex')(knexFile.development);

// Create an artwork
router.post('/', (req, res) => {
  const { title, image_url, location_geohash } = req.body;
  const artist_uuid = uuidv4(); // Generate a UUID for the artist

  if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
    db('artworks')
      .insert({ title, artist_uuid, image_url, location_geohash })
      .returning('*') // Use returning('*') to get the inserted data
      .then((insertedData) => {
        const insertedArtwork = insertedData[0];
        res.status(200).json({
          message: 'Artwork created successfully',
          artwork: insertedArtwork,
        });
      })
      .catch((error) => {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
      });
      
  } else {
    res.status(401).send({ message: 'Data not formatted correctly' });
  }
});

// Read all artworks
router.get('/', (req, res) => {
  db('artworks')
    .select()
    .then((artworks) => res.status(200).json(artworks))
    .catch((error) => res.status(500).json({ error }));
});

// Read artwork by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && typeof(id) == 'number' && id < 9999999) {
    db('artworks')
      .where({ id })
      .first()
      .then((artwork) => {
        if (artwork) {
          res.json(artwork).status(200);
        } else {
          res.status(404).json({ error: 'Artwork not found' });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching artwork', e: error });
      });
  } else {
    res.status(401).json({ error: 'negative id provided'})
  }
});

// Update an artwork
router.put('/:id', (req, res) => {
  const { title, artist_uuid, image_url, location_geohash } = req.body;

  db('artworks')
    .where({ id: req.params.id })
    .update({ title, artist_uuid, image_url, location_geohash })
    .then(() => res.status(200).json({ message: 'Artwork updated successfully' }))
    .catch((error) => res.status(500).json({ error }));
});

// Delete an artwork
router.delete('/:id', (req, res) => {
  db('artworks')
    .where({ id: req.params.id })
    .del()
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
