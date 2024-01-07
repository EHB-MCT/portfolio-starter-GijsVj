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


/**
* Structure artist object and parameter
*
* @param {string} uuid: Unique identifier for the artist.
* @param {string} artist - The name of the artist.
* @param {number} birthyear - The birth year of the artist.
* @param {number} artwork_count - The count of artworks associated with the artist.
*/

/**
 * Create Artist
 *
 * Creates a new artist in the 'artists' table in the database.
 *
 * @route POST /
 * @param {Object} req.body - The request body containing artist details.
 * @param {string} req.body.artist - The name of the artist.
 * @param {number} req.body.birthyear - The birth year of the artist.
 * @param {number} req.body.artwork_count - The count of artworks by the artist.
 * @returns {Object} 201 - A success message and the created artist object.
 * @returns {Object} 400 - An error object if the request data is not formatted correctly.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name CreateArtist
 * @function
 */
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


/**
 * Get All Artists
 *
 * Retrieves a list of all artists from the 'artists' table in the database.
 *
 * @route GET /
 * @returns {Object} 200 - An array of artist objects.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name GetAllArtists
 * @function
 */
router.get('/', async (req, res) => {
  try {
    const artists = await db('artists').select();
    res.status(200).json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching artists', e: error });
  }
});



/**
 * Get Artist by UUID
 *
 * Retrieves an artist from the 'artists' table by UUID.
 *
 * @route GET /:uuid
 * @param {string} req.params.uuid - The UUID of the artist to retrieve.
 * @returns {Object} 200 - The artist object.
 * @returns {Object} 400 - An error object if the provided UUID is invalid.
 * @returns {Object} 404 - An error object if the artist is not found.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name GetArtistByUUID
 * @function
 */
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

/**
 * Update Artist
 *
 * Updates an existing artist in the 'artists' table by UUID.
 *
 * @route PUT /:uuid
 * @param {Object} req.body - The request body containing artist details.
 * @param {string} req.body.uuid - The UUID of the artist to update.
 * @param {string} req.body.artist - The updated name of the artist.
 * @param {number} req.body.birthyear - The updated birth year of the artist.
 * @param {number} req.body.artwork_count - The updated count of artworks by the artist.
 * @returns {Object} 200 - A success message.
 * @returns {Object} 400 - An error object if the request data is not formatted correctly.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name UpdateArtist
 * @function
 */
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

/**
 * Delete Artist
 *
 * Deletes an existing artist in the 'artists' table by UUID.
 *
 * @route DELETE /:uuid
 * @param {string} req.params.uuid - The UUID of the artist to delete.
 * @returns {Object} 204 - A success message.
 * @returns {Object} 400 - An error object if the provided UUID is invalid.
 * @returns {Object} 404 - An error object if the artist is not found.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name DeleteArtist
 * @function
 */
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
