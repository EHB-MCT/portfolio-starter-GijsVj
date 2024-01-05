const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist here

describe('POST /artworks/:id', () => {

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  it('should create a new artwork and return 200 status', async () => {
    // Send a POST request to the endpoint with the correct data
    const response = await request(app)
      .post('/artworks')
      .send(exampleArtwork);
  
    // Check the response status
    expect(response.status).toBe(200);
  
    // Ensure that the response body has the expected structure
    expect(response.body).toHaveProperty('artwork');
  
    // Fetch the artworkResponse from the response body
    const artworkResponse = response.body.artwork;
  
    // Ensure that the artworkResponse has an 'id' property
    expect(artworkResponse).toHaveProperty('id');
  
    // Fetch the artwork from the database using the ID
    const dbRecord = await db('artworks').select('*').where('id', artworkResponse.id);
  
    // Check the properties of the fetched artwork
    expect(dbRecord[0]).toHaveProperty('id', artworkResponse.id);
    expect(dbRecord[0]).toHaveProperty('title', exampleArtwork.title);
  
    // Use the dynamically generated artist_uuid from the response in your assertion
    expect(dbRecord[0]).toHaveProperty('artist_uuid', artworkResponse.artist_uuid);
  
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