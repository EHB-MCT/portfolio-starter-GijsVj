const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist here

describe('GET /artworks/:id', () => {

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

  it('should return the correct artwork when a valid ID is provided', async () => {
    // Send a GET request to the endpoint with the correct ID
    const response = await request(app)
      .get(`/artworks/${exampleArtwork.id}`);
    
    // Check the response status
    expect(response.status).toBe(200);
  
    // Ensure that the response body has the expected structure
    expect(response.body).toBeTruthy(); // Check if the response body is truthy
    
    // Fetch the artworkResponse from the response body
    const artworkResponse = response.body;
  
    // Fetch the artwork from the database using the ID
    const dbRecord = await db("artworks").select("*").where("id", exampleArtwork.id);
  
    // Check the properties of the fetched artwork
    expect(dbRecord[0]).toHaveProperty('id', exampleArtwork.id);
    expect(dbRecord[0]).toHaveProperty('title', exampleArtwork.title);
    expect(dbRecord[0]).toHaveProperty('artist_uuid', exampleArtwork.artist_uuid);
    expect(dbRecord[0]).toHaveProperty('image_url', exampleArtwork.image_url);
    expect(dbRecord[0]).toHaveProperty('location_geohash', exampleArtwork.location_geohash);
  });

  it('should return 401, wrong artwork record', async () => {
    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app)
      .get(`/artworks/invalid_id`);
    // Check the response status
    expect(response.status).toBe(401);
  });
});