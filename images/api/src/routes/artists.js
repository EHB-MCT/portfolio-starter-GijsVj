const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  checkArtistName, 
  checkArtistBirthyear, 
  checkArtistArtcount 
} = require('../helpers/artistEndpointHelpers');
const { isValidUUID } = require('../helpers/uuidValidator');
const knex = require('../db/knexfile');

const db = require('knex')(knex.development);

router.post('/', async (req, res) => {
  const { artist, birthyear, artwork_count } = req.body;
  const uuid = uuidv4();

  try {
    if (checkArtistName(artist) && checkArtistBirthyear(birthyear) && checkArtistArtcount(artwork_count)) {
      const [insertedArtist] = await db('artists').insert({ uuid, artist, birthyear, artwork_count }).returning('*');

      res.status(201).json({
        message: 'Artist created successfully',
        artist: insertedArtist,
      });
    } else {
      res.status(400).send({ message: 'Data not formatted correctly' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating artist', e: error });
  }
});

// Read all artists
router.get('/', async (req, res) => {
  try {
    const artists = await db('artists').select();
    res.status(200).json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching artists', e: error });
  }
});

// Read artist by uuid
router.get('/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  if (!isValidUUID(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
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
router.put('/:uuid', async (req, res) => {
  const { uuid, artist, birthyear, artwork_count } = req.body;

  try {
    if (checkArtistName(artist) && checkArtistBirthyear(birthyear) && checkArtistArtcount(artwork_count)) {
      await db('artists').where({ uuid }).update({ artist, birthyear, artwork_count });

      res.status(200).json({ message: 'Artist updated successfully' });
    } else {
      res.status(400).send({ message: 'Data not formatted correctly' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating artist', e: error });
  }
});

// Delete an artist
router.delete('/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  if (!isValidUUID(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID provided' });
  }

  try {
    const deletedCount = await db('artists').where({ uuid }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting artist', e: error });
  }
});

module.exports = router;
