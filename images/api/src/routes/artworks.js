const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  checkArtworkTitle, 
  checkArtworkImage, 
  checkArtworkLocation 
} = require('../helpers/artworkEndpointHelpers');
const knex = require('../db/knexfile');

const db = require('knex')(knex.development);

router.post('/', async (req, res) => {
  const { title, image_url, location_geohash } = req.body;
  let { artist_uuid } = req.body;

  if (!artist_uuid) {
    artist_uuid = uuidv4();
  }

  if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
    try {
      const insertedData = await db('artworks').insert({ title, artist_uuid, image_url, location_geohash }).returning('*');
      const insertedArtwork = insertedData[0];

      return res.status(201).json({
        message: 'Artwork created successfully',
        artwork: insertedArtwork,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(400).json({ message: 'Data not formatted correctly' });
  }
});

router.get('/', (req, res) => {
  db('artworks')
    .select()
    .then((artworks) => res.status(200).json(artworks))
    .catch(() => res.status(500).json({ error: 'Internal Server Error' }));
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (id >= 0 && Number.isInteger(id) && id < 9999999) {
    try {
      const artwork = await db('artworks').where({ id }).first();

      if (artwork) {
        return res.status(200).json(artwork);
      } else {
        return res.status(404).json({ error: 'Artwork not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid ID provided' });
  }
});

router.put('/:artworkId', async (req, res) => {
  const artworkId = req.params.artworkId;

  if (!Number.isInteger(Number(artworkId))) {
    return res.status(400).json({ message: 'Invalid artwork ID' });
  }

  const { title, image_url, location_geohash } = req.body;

  try {
    const existingArtwork = await db('artworks').where({ id: artworkId }).first();

    if (!existingArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
      const updatedData = await db('artworks').where({ id: artworkId }).update({ title, image_url, location_geohash }).returning('*');

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
      return res.status(400).json({ message: 'Data not formatted correctly' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const artworkId = parseInt(req.params.id);

  if (isNaN(artworkId) || artworkId < 0 || artworkId >= 9999999) {
    return res.status(404).json({ error: 'Invalid ID provided' });
  }

  try {
    const deletedCount = await db('artworks').where({ id: artworkId }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
