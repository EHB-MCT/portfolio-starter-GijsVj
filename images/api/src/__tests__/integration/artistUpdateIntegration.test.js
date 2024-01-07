const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * Update Artist
 *
 * Updates an existing artist record in the 'artists' table with the provided data.
 *
 * @route PUT /artists/:uuid
 * @param {string} :uuid.path.required - The UUID of the artist to be updated.
 * @returns {Object} 200 - The updated artist object.
 * @returns {Object} 400 - An error object if invalid data is provided, or if the artist does not exist, or if the UUID is invalid.
 * @name UpdateArtist
 * @function
 */
describe('PUT /artists/:uuid', () => {
  // Variables to store inserted artist and record for testing purposes
  let insertedArtist;
  let insertedRecord;
  // Variables for example artwork and artist data
  let exampleArtwork;
  let exampleArtist;

  /**
   * Set up before running the tests
   *
   * Inserts an example artist and artwork record into the database.
   *
   * @function
   * @name beforeAll
   */
  beforeAll(async () => {
    try {
      // Example artist data
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20,
      };

      // Insert the example artist into the 'artists' table
      insertedArtist = await db('artists').insert(exampleArtist).returning('*');

      // Example artwork data related to the inserted artist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43',
      };

      // Insert the example artwork into the 'artworks' table
      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning('*');

    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * Clean up after running the tests
   *
   * Deletes the inserted artwork and artist records from the database.
   *
   * @function
   * @name afterAll
   */
  afterAll(async () => {
    try {
      // Delete the inserted artwork record
      await db('artworks').where({ id: insertedRecord[0].id }).del();
      // Delete the inserted artist record
      await db('artists').where({ uuid: exampleArtist.uuid }).del();
      // Destroy the database connection
      await db.destroy();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  /**
   * Test case: Update artist with valid data
   *
   * Verifies that the endpoint updates the artist when valid data is provided.
   *
   * @function
   * @name shouldUpdateArtistWithValidData
   */
  it('should update the artist when valid data is provided', async () => {
    // Create updated artist data
    const updatedArtist = { ...insertedArtist[0], artist: 'Picasso' };

    // Make a PUT request to update the artist
    const response = await request(app)
      .put(`/artists/${exampleArtist.uuid}`)
      .send(updatedArtist);

    // Verify the response status is 200
    expect(response.status).toBe(200);

    // Retrieve the updated artist record from the database
    const dbRecord = await db('artists').select('*').where('uuid', exampleArtist.uuid);
    // Verify that exactly one record is found
    expect(dbRecord.length).toBe(1);

    // Extract the updated record
    const updatedRecord = dbRecord[0];
    // Verify that the artist fields are updated correctly
    expect(updatedRecord.artist).toBe(updatedArtist.artist);
    expect(updatedRecord.birthyear).toBe(updatedArtist.birthyear);
    expect(updatedRecord.artwork_count).toBe(updatedArtist.artwork_count);
  });

  /**
   * Test case: Return 400 when invalid data is provided
   *
   * Verifies that the endpoint returns a 400 status when invalid data is provided.
   *
   * @function
   * @name shouldReturn400WhenInvalidDataProvided
   */
  it('should return 400 when invalid data is provided', async () => {
    // Invalid artist data
    const invalidArtist = {
      artist: '',
      birthyear: 'invalid_year',
      artwork_count: 'invalid_count',
    };

    // Make a PUT request to update the artist with invalid data
    const response = await request(app)
      .put(`/artists/${exampleArtist.uuid}`)
      .send(invalidArtist);

    // Verify the response status is 400
    expect(response.status).toBe(400);
  });

  /**
   * Test case: Return 400 when updating non-existing artist
   *
   * Verifies that the endpoint returns a 400 status when trying to update a non-existing artist.
   *
   * @function
   * @name shouldReturn400WhenUpdatingNonExistingArtist
   */
  it('should return 400 when updating non-existing artist', async () => {
    // Generate a random UUID that does not exist in the database
    const nonExistingUuid = uuidv4();

    // Make a PUT request to update a non-existing artist
    const response = await request(app)
      .put(`/artists/${nonExistingUuid}`)
      .send({});

    // Verify the response status is 400
    expect(response.status).toBe(400);
  });

  /**
   * Test case: Return 400 when updating with an invalid UUID
   *
   * Verifies that the endpoint returns a 400 status when updating with an invalid UUID.
   *
   * @function
   * @name shouldReturn400WhenUpdatingWithInvalidUUID
   */
  it('should return 400 when updating with an invalid UUID', async () => {
    // Invalid UUID
    const invalidUuid = 'invalid_uuid';

    // Make a PUT request to update with an invalid UUID
    const response = await request(app)
      .put(`/artists/${invalidUuid}`)
      .send({});

    // Verify the response status is 400
    expect(response.status).toBe(400);
  });
});