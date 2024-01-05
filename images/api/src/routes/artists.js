const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Importing UUID library
const { checkArtistName } = require('../helpers/artistNameEndpointHelpers.js');
const { checkArtistBirthyear } = require('../helpers/artistBirthyearEndpointHelpers.js');
const { checkArtistArtcount } = require('../helpers/artistArtcountEndpointHelpers.js');
const { isValidUUID } = require('../uuidValidator.js')

const knexFile = require("../db/knexfile.js")
const db = require('knex')(knexFile.development);

// Create an artist
router.post('/', (req, res) => {
  const { artist, birthyear, artwork_count } = req.body;
  const uuid = uuidv4(); // Generate a unique UUID for the artist

  if(checkArtistName(artist) && checkArtistBirthyear(birthyear) && checkArtistArtcount(artwork_count)){
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
  } else {
    res.status(401).send({ message: 'Data not formatted correctly' });
  }
});

// Read all artists
router.get('/', (req, res) => {
  db('artists')
    .select()
    .then((artists) => res.status(200).json(artists))
    .catch((error) => res.status(500).json({ error }));
});

// Read artist by uuid
router.get('/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  // Validate if the provided UUID is a valid UUID format
  if (!isValidUUID(uuid)) {
    return res.status(401).json({ error: 'Invalid UUID format' });
  }

  try {
    const artist = await db('artists').where({ uuid }).first();

    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ error: 'Artist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching artist', e: error });
  }
});

// Update an artist
router.put('/:uuid', (req, res) => {
  const {uuid, artist, birthyear, artwork_count } = req.body;

  if(checkArtistName(artist) && checkArtistBirthyear(birthyear) && checkArtistArtcount(artwork_count)){
    db('artists')
    .where({ uuid })
    .update({ artist, birthyear, artwork_count })
    .then(() => res.status(200).json({ message: 'Artist updated successfully' }))
    .catch((error) => res.status(500).json({ error }));
  } else {
    res.status(401).send({ message: 'Data not formatted correctly' });
  }
});

// Delete an artwork
router.delete('/:uuid', (req, res) => {
  const uuid = req.params.uuid;

  if (!isValidUUID(uuid)) {
    // Invalid ID provided
    return res.status(401).json({ error: 'Invalid UUID provided' });
  }

  db('artists')
    .where({ uuid: uuid })
    .del()
    .then((deletedCount) => {
      if (deletedCount === 0) {
        // Artist not found
        return res.status(404).json({ error: 'Artist not found' });
      }
      // Artist deleted successfully
      res.status(204).send();
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
