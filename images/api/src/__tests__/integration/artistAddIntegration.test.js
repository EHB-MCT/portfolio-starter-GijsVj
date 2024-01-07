const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * Create Artist Integration Test
 *
 * Endpoint to create a new artist by sending a POST request to '/artists'.
 * Inserts a test artist into the 'artists' table and associated artwork into the 'artworks' table for testing purposes.
 *
 * @route POST /artists
 * @returns {Object} 201 - The created artist along with 201 status.
 * @returns {Object} 400 - Bad request for invalid artist data.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name CreateArtist
 * @function
 */
describe('POST /artists/:uuid', () => {
  let insertedArtist;
  let exampleArtist;
  let exampleArtwork;

  /**
   * Setup before running the tests.
   * - Defines an example artist.
   * - Inserts the artist into the 'artists' table.
   * - Defines an example artwork associated with the inserted artist.
   * - Inserts the artwork into the 'artworks' table.
   */
  beforeAll(async () => {
    try {
      // Define exampleArtist
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Vincent van Gogh',
        birthyear: 1853,
        artwork_count: 863
      };
  
      // Insert the artist
      await db('artists').insert({ ...exampleArtist });
  
      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: exampleArtist.uuid, // Use the UUID generated for the artist
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };
  
      // Insert the artwork
      const insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning('*');
      exampleArtwork = insertedRecord[0];
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * Cleanup after running the tests.
   * - Deletes the test record from the 'artworks' table.
   * - Destroys the database connection.
   */
  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  /**
   * Test case: Should create a new artist and return 201 status.
   */
  it('should create a new artist and return 201 status', async () => {
    // Send a POST request to the endpoint with the artist data
    const response = await request(app)
      .post('/artists')
      .send(exampleArtist);

    // Check the response status
    expect(response.status).toBe(201);

    // Ensure that the response body has the expected structure
    expect(response.body).toBeTruthy();

    // Fetch the artist from the database using the UUID
    const dbRecord = await db('artists').select('*').where('uuid', exampleArtist.uuid);

    // Check the properties of the fetched artist
    expect(dbRecord[0]).toMatchObject(exampleArtist);

    const response2 = await request(app).get(`/artists`);
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
  });

  /**
   * Test case: Should return 400 for invalid artist data.
   */
  it('should return 400 for invalid artist data', async () => {
    // Send a POST request to the endpoint with invalid artist data
    const response = await request(app)
      .post('/artists')
      .send({ invalidField: 'Invalid Data' });

    // Check the response status
    expect(response.status).toBe(400);
  });
});