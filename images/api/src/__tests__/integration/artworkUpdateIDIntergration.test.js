const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('PUT /artworks/:id', () => {
  beforeAll(async () => {
    try {
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20,
      };

      insertedArtist = await db('artists').insert(exampleArtist).returning('*');

      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43',
      };

      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning('*');
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  it('should update the artwork when valid data is provided', async () => {
    const updatedArtwork = {
      title: 'Updated Mona Lisa',
      artist_uuid: exampleArtwork.artist_uuid,
      image_url: 'https://example.com/updated_mona_lisa.jpg',
      location_geohash: 'u4pruydqqw44',
    };
  
    // Check if the artist with the given UUID exists
    const artistExists = await db('artists').where('uuid', updatedArtwork.artist_uuid).first();
  
    if (!artistExists) {
      // If the artist doesn't exist, insert a new artist
      const newArtist = {
        uuid: updatedArtwork.artist_uuid,
        artist: 'New Artist', // Provide a default name or fetch it from somewhere
        birthyear: 2000, // Provide a default birth year or fetch it from somewhere
        artwork_count: 0,
      };
  
      await db('artists').insert(newArtist);
    }
  
    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(updatedArtwork);
  
    expect(response.status).toBe(200);
  
    const dbRecord = await db('artworks').select('*').where('id', exampleArtwork.id);
    expect(dbRecord.length).toBe(1);
  
    const updatedRecord = dbRecord[0];
    expect(updatedRecord.title).toBe(updatedArtwork.title);
    expect(updatedRecord.image_url).toBe(updatedArtwork.image_url);
    expect(updatedRecord.location_geohash).toBe(updatedArtwork.location_geohash);
  });

  it('should return 401 when invalid data is provided', async () => {
    // Assume invalidArtwork has invalid data
    const invalidArtwork = {
      title: '', // Invalid title
      artist_uuid: uuidv4(), // Invalid artist_uuid
      image_url: 'https://example.com/invalid_image.jpg',
      location_geohash: 'invalid_hash',
    };
  
    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(invalidArtwork);
  
    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return 404 when updating non-existing artwork', async () => {
    const nonExistingId = 999999; // Non-existing ID
  
    const response = await request(app)
      .put(`/artworks/${nonExistingId}`)
      .send({});
  
    // Check the response status
    expect(response.status).toBe(404);
  });

  it('should return 401 when updating with an invalid ID', async () => {
    const invalidId = 'invalid_id'; // Invalid ID

    const response = await request(app)
      .put(`/artworks/${invalidId}`)
      .send({});

    expect(response.status).toBe(401);
  });
});
