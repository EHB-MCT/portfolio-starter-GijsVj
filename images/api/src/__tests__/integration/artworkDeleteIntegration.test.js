const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('DELETE /artworks/:id', () => {

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

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

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

  it('should return 404 when trying to delete a non-existing artwork', async () => {
    // Send a DELETE request to the endpoint with the non-existing ID
    const response = await request(app).delete(`/artworks/${exampleArtwork.id}`);
  
    // Check the response status
    expect(response.status).toBe(404);
  });

  it('should return 404 when trying to delete with an invalid ID', async () => {
    // Send a DELETE request to the endpoint with an invalid ID
    const response = await request(app)
      .delete(`/artworks/invalid_id`);
    
    // Check the response status
    expect(response.status).toBe(404);
  });
});