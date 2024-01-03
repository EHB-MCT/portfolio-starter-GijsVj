const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Importing UUID library
const { checkArtworkTitle } = require('../helpers/artworkTitleEndpointHelpers.js');

const knexFile = require("../db/knexfile.js")
const db = require('knex')(knexFile.development);

// Create an artist
router.post('/', (req, res) => {
  const { artist, birthyear, artwork_count } = req.body;
  const uuid = uuidv4(); // Generate a unique UUID for the artist

  db('artists')
    .insert({ uuid, artist, birthyear, artwork_count })
    .returning('*') // Use returning('*') to get the inserted data
    .then((insertedData) => {
      const insertedArtist = insertedData[0];
      res.status(200).json({
        message: 'Artist created successfully',
        artist: insertedArtist,
      });
    })
    .catch((error) => res.status(500).json({ error }));
});

// Read all artists
router.get('/', (req, res) => {
  db('artists')
    .select()
    .then((artists) => res.status(200).json(artists))
    .catch((error) => res.status(500).json({ error }));
});

// Read artist by uuid
router.get('/:uuid', (req, res) => {
  const uuid = req.params.uuid;

  db('artists')
    .where({ uuid })
    .first()
    .then((artist) => {
      if (artist) {
        res.json(artist).status(200);
      } else {
        res.status(404).json({ error: 'Artist not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching artist', e: error });
    });
});

// Update an artist
router.put('/:uuid', (req, res) => {
  const { artist, birthyear, artwork_count } = req.body;

  db('artists')
    .where({ uuid: req.params.uuid })
    .update({ artist, birthyear, artwork_count })
    .then(() => res.status(200).json({ message: 'Artist updated successfully' }))
    .catch((error) => res.status(500).json({ error }));
});

// Delete an artist
router.delete('/:uuid', (req, res) => {
  db('artists')
    .where({ uuid: req.params.uuid })
    .del()
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
