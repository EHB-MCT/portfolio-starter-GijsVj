const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

/**
 * Delete Artwork by ID
 *
 * Deletes an artwork from the 'artworks' table in the database based on the provided ID.
 *
 * @route DELETE /artworks/:id
 * @param {string} id.path.required - The ID of the artwork to be deleted.
 * @returns {Object} 204 - No content.
 * @returns {Object} 404 - Not Found. If the artwork with the provided ID does not exist.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name DeleteArtworkByID
 * @function
 */

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('DELETE /artworks/:id', () => {

  /**
   * Setup before tests
   */
  beforeAll(async () => {
    try {
      // Create a new UUID for the artist
      const ARTISTUUID = uuidv4();
      exampleArtist = {
        uuid: ARTISTUUID,
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20
      };

      // Insert the artist
      insertedArtist = await db('artists').insert(exampleArtist).returning("*");

      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork
      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * Cleanup after tests
   */
  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  /**
   * Test: Delete artwork with a valid ID
   */
  it('should delete the artwork when a valid ID is provided', async () => {
    // Send a DELETE request to the endpoint with the correct ID
    const response = await request(app)
      .delete(`/artworks/${exampleArtwork.id}`);
    
    // Check the response status
    expect(response.status).toBe(204);
  
    // Fetch the artwork from the database using the ID
    const dbRecord = await db("artworks").select("*").where("id", exampleArtwork.id);
  
    // Check that the artwork no longer exists in the database
    expect(dbRecord.length).toBe(0);
  });

  /**
   * Test: Attempt to delete a non-existing artwork
   */
  it('should return 404 when trying to delete a non-existing artwork', async () => {
    // Send a DELETE request to the endpoint with the non-existing ID
    const response = await request(app).delete(`/artworks/${exampleArtwork.id}`);
  
    // Check the response status
    expect(response.status).toBe(404);
  });

  /**
   * Test: Attempt to delete artwork with an invalid ID
   */
  it('should return 404 when trying to delete with an invalid ID', async () => {
    // Send a DELETE request to the endpoint with an invalid ID
    const response = await request(app)
      .delete(`/artworks/invalid_id`);
    
    // Check the response status
    expect(response.status).toBe(404);
  });
});