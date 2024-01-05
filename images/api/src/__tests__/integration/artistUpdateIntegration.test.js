const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('PUT /artists/:uuid', () => {
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
      

    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artworks').where({ id: insertedRecord[0].id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  it('should update the artist when valid data is provided', async () => {
    const updatedArtist = { ...insertedArtist[0], artist:"picasso", uuid:exampleArtist.uuid };
  
    const response = await request(app)
      .put(`/artists/${exampleArtist.uuid}`)
      .send(updatedArtist);
  
    expect(response.status).toBe(200);
  
    const dbRecord = await db('artists').select('*').where('uuid', exampleArtist.uuid);
    expect(dbRecord.length).toBe(1);
  
    const updatedRecord = dbRecord[0];
    expect(updatedRecord.artist).toBe(updatedArtist.artist);
    expect(updatedRecord.birthyear).toBe(updatedArtist.birthyear);
    expect(updatedRecord.artwork_count).toBe(updatedArtist.artwork_count);
  });

  it('should return 401 when invalid data is provided', async () => {
    // Assume invalidArtist has invalid data
    const invalidArtist = {
      artist: '', // Invalid artist name
      birthyear: 'invalid_year', // Invalid birth year
      artwork_count: 'invalid_count', // Invalid artwork count
    };

    const response = await request(app)
      .put(`/artists/${exampleArtist.uuid}`)
      .send(invalidArtist);

    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return 404 when updating non-existing artist', async () => {
    const nonExistingUuid = uuidv4(); // Non-existing UUID

    const response = await request(app)
      .put(`/artists/${nonExistingUuid}`)
      .send({});

    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return 401 when updating with an invalid UUID', async () => {
    const invalidUuid = 'invalid_uuid'; // Invalid UUID

    const response = await request(app)
      .put(`/artists/${invalidUuid}`)
      .send({});

    expect(response.status).toBe(401);
  });
});