const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

let insertedArtist;
let exampleArtist;

describe('DELETE /artists/:uuid', () => {
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
      insertedArtist = await db('artists').insert(exampleArtist).returning('*')  
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
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db.destroy();
  });

  it('should delete the artist when a valid UUID is provided', async () => {
    // Send a DELETE request to the endpoint with the correct ID
    const response = await request(app)
    .delete(`/artists/${exampleArtist.uuid}`);
      
    // Check the response status
    expect(response.status).toBe(204);
    
    // Fetch the artwork from the database using the ID
    const dbRecord = await db('artists').select('*').where('uuid', exampleArtist.uuid);
    
    // Check that the artwork no longer exists in the database
    expect(dbRecord.length).toBe(0);

  });

  
  it('should return a 404 status when trying to delete a non-existing artist', async () => {
    const invalidArtistUuid = "550e8400-e29b-41d4-a716-446655440000";
  
    // Send a DELETE request to the endpoint with the non-existing ID
    const response = await request(app).delete(`/artists/${insertedArtist[0].uuid}`);
      
    // Check the response status
    expect(response.status).toBe(404);
  });


  it('should return a 401 status when a invalid uuid is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtistUuid = 'hsgsgsgdg';
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(401);
  });


  it('should return a 401 status when numberic is provided', async () => {
    const invalidArtistUuid = 12;

    // Send a GET request to the endpoint with an invalid UUID
    const response = await request(app).get(`/artists/${invalidArtistUuid}`);

    // Check the response status
    expect(response.status).toBe(401);
  });
});