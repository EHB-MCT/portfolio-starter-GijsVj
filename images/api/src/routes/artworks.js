const express = require('express');
const router = express.Router();
const { checkArtworkTitle } = require('../helpers/artworkTitleEndpointHelpers.js');
const { checkArtworkImage } = require('../helpers/artworkImageEndpointHelpers.js');
const { checkArtworkLocation } = require('../helpers/artworkLocationEndpointHelpers.js');
const { v4: uuidv4 } = require('uuid');

const knexFile = require("../db/knexfile.js");

const db = require('knex')(knexFile.development);

// Create an artwork
router.post('/', (req, res) => {
  const { title, image_url, location_geohash } = req.body;
  const artist_uuid = uuidv4();

  if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
    db('artworks')
      .insert({ title, artist_uuid, image_url, location_geohash })
      .returning('*')
      .then((insertedData) => {
        const insertedArtwork = insertedData[0];
        res.status(200).json({
          message: 'Artwork created successfully',
          artwork: insertedArtwork,
        });
      })
      .catch((error) => {
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
router.put('/:artworkId', async (req, res) => {
  const artworkId = req.params.artworkId;

  // Validate that the artwork ID is a valid integer
  if (!Number.isInteger(Number(artworkId))) {
    return res.status(401).send({ message: 'Invalid artwork ID' });
  }

  const { title, image_url, location_geohash } = req.body;

  try {
    // Check if the artwork with the given ID exists
    const existingArtwork = await db('artworks').where({ id: artworkId }).first();

    if (!existingArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
      const updatedData = await db('artworks')
        .where({ id: artworkId })
        .update({ title, image_url, location_geohash })
        .returning('*');

      if (updatedData.length > 0) {
        const updatedArtwork = updatedData[0];
        return res.status(200).json({
          message: 'Artwork updated successfully',
          artwork: updatedArtwork,
        });
      } else {
        return res.status(404).json({ error: 'Artwork not found' });
      }
    } else {
      return res.status(401).send({ message: 'Data not formatted correctly' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Delete an artwork
router.delete('/:id', (req, res) => {
  const artworkId = parseInt(req.params.id);

  if (isNaN(artworkId) || artworkId < 0 || artworkId >= 9999999) {
    // Invalid ID provided
    return res.status(401).json({ error: 'Invalid ID provided' });
  }

  db('artworks')
    .where({ id: artworkId })
    .del()
    .then((deletedCount) => {
      if (deletedCount === 0) {
        // Artwork not found
        return res.status(404).json({ error: 'Artwork not found' });
      }
      // Artwork deleted successfully
      res.status(204).send();
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;