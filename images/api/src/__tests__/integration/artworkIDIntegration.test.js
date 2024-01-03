const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist at a higher scope

describe('GET /artworks/:id', () => {
  
  beforeAll(async () => {
    try {
      // Define exampleArtist
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20
      };

      // Insert the artist and get the inserted record
      insertedArtist = await db('artists').insert(exampleArtist).returning("*");

      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork and get the inserted record
      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    // Uncomment the following lines when you are ready to implement the cleanup logic
    await db('artworks').where({ id: exampleArtwork.id}).del();
    await db('artists').where({uuid: exampleArtist.uuid}).del();
    await db.destroy();
  });

  it('should return the correct artwork when a valid ID is provided', async () => {
    // Assume you have an artwork with ID 1 in your test data
    const validArtworkUuid = exampleArtwork.artist_uuid;
    const validArtworkId = exampleArtwork.id;
    const validArtworkImage = exampleArtwork.image_url;
    const validArtworkLocation = exampleArtwork.location_geohash;
    const validArtworkTitle = exampleArtwork.title;

    // Send a GET request to the endpoint
    const response = await request(app).get(`/artworks/${validArtworkId}`);
    // Check the response status
    expect(response.status).toBe(200);

    const dbRecord = await db("artworks").select("*").where("id", validArtworkId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id', validArtworkId);

    // Check if the response body contains the expected artwork details
    expect(response.body).toEqual({
      id: validArtworkId,
      artist_uuid: validArtworkUuid,
      image_url: validArtworkImage,
      location_geohash: validArtworkLocation,
      title: validArtworkTitle

      // Add other expected properties of the artwork here
    });
  });

  it('should return a 404 status when an invalid ID is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = 99999;


    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(404);

    const dbRecord = await db("artworks").select("*").where("id", invalidArtworkId);
    expect(dbRecord.length).toBe(0);
    //expect(dbRecord[0]).not.toHaveProperty('id');
    //expect(dbRecord.id).toBe(undefined);
  });

  it('should return a 401 status when a negative ID is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = -12;
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return a 401 status when a string is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = 'hello';
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return a 401 status when too large id is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = 9999999;
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(401);
  });
});