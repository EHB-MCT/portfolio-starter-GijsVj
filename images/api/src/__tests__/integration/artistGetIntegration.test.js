const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * Get Artist by UUID
 *
 * Retrieves information about an artist based on the provided UUID.
 *
 * @route GET /artists/:uuid
 * @param {string} uuid.path.required - The UUID of the artist.
 * @returns {Object} 200 - An object containing details of the artist.
 * @returns {Object} 404 - If the artist with the provided UUID is not found.
 * @returns {Object} 400 - If an invalid UUID or numeric value is provided.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name GetArtistByUUID
 * @function
 */
let insertedArtist;
let exampleArtist;
let exampleArtwork;

describe('GET /artists/:uuid', () => {
  beforeAll(async () => {
    try {
      // Define exampleArtist
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Vincent van Gogh',
        birthyear: 1853,
        artwork_count: 864
      };

      // Insert the artist and get the inserted record
      insertedArtist = await db('artists').insert(exampleArtist).returning('*');

      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork
      const insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning('*');
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db.destroy();
  });

  /**
   * Test for successful retrieval of an artist with a valid UUID.
   */
  it('should return the correct artist when a valid UUID is provided', async () => {
    const validArtistUuid = insertedArtist[0].uuid;

    // Send a GET request to the endpoint
    const response = await request(app).get(`/artists/${validArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(200);

    const dbRecord = await db('artists').select('*').where('uuid', validArtistUuid);
    expect(dbRecord.length).toBeGreaterThan(0);

    // Check if the response body contains the expected artist details
    expect(response.body).toEqual({
      uuid: validArtistUuid,
      artist: exampleArtist.artist,
      birthyear: exampleArtist.birthyear,
      artwork_count: exampleArtist.artwork_count,
    });
  });

  /**
   * Test for 404 status when a non-existing artist is provided.
   */
  it('should return a 404 status when a non-existing artist is provided', async () => {
    const invalidArtistUuid = '550e8400-e29b-41d4-a716-446655440000';

    // Send a GET request to the endpoint with an invalid UUID
    const response = await request(app).get(`/artists/${invalidArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(404);

    const dbRecord = await db('artists').select('*').where('uuid', invalidArtistUuid);
    expect(dbRecord.length).toBe(0);
  });

  /**
   * Test for 400 status when an invalid UUID is provided.
   */
  it('should return a 400 status when an invalid UUID is provided', async () => {
    const invalidArtistUuid = 'fsedrfesfwefrefsaefsaef';

    // Send a GET request to the endpoint with an invalid UUID
    const response = await request(app).get(`/artists/${invalidArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(400);
  });

  /**
   * Test for 400 status when a numeric value is provided.
   */
  it('should return a 400 status when a numeric value is provided', async () => {
    const invalidArtistUuid = 12;

    // Send a GET request to the endpoint with an invalid UUID
    const response = await request(app).get(`/artists/${invalidArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(400);
  });
});
