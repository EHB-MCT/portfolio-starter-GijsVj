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
  
    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(updatedArtwork);
  
    expect(response.status).toBe(200);
  
    const dbRecord = await db('artworks').select('*').where('id', exampleArtwork.id).first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.title).toBe(updatedArtwork.title);
    expect(dbRecord.image_url).toBe(updatedArtwork.image_url);
    expect(dbRecord.location_geohash).toBe(updatedArtwork.location_geohash);
  });

  it('should return 400 when invalid data is provided', async () => {
    const invalidArtwork = {
      title: '', 
      artist_uuid: uuidv4(), 
      image_url: 'https://example.com/invalid_image.jpg',
      location_geohash: 'invalid_hash',
    };

    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(invalidArtwork);

    expect(response.status).toBe(400);
  });

  it('should return 404 when updating non-existing artwork', async () => {
    const nonExistingId = 999999;

    const response = await request(app)
      .put(`/artworks/${nonExistingId}`)
      .send({});

    expect(response.status).toBe(404);
  });

  it('should return 400 when updating with an invalid ID', async () => {
    const invalidId = 'invalid_id';

    const response = await request(app)
      .put(`/artworks/${invalidId}`)
      .send({});

    expect(response.status).toBe(400);
  });
});