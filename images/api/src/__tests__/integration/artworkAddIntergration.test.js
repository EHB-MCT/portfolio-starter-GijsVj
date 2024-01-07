const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * Create Artwork
 *
 * Creates a new artwork entry in the 'artworks' table with the provided data.
 * The artist associated with the artwork is also inserted into the 'artists' table.
 *
 * @route POST /artworks
 * @returns {Object} 201 - The created artwork object.
 * @returns {Object} 400 - Bad request if the provided data is not formatted correctly.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name CreateArtwork
 * @function
 */
describe('POST /artworks/:id', () => {

  // Set up variables to store inserted artist and example artwork
  let insertedArtist;
  let exampleArtwork;
  let exampleArtist;

  // Set up beforeAll hook to create an example artist and artwork
  beforeAll(async () => {
    // Generate a unique UUID for the artist
    const ARTISTUUID = uuidv4();

    // Define an example artist object
    exampleArtist = {
      uuid: ARTISTUUID,
      artist: 'Leonardo da Vinci',
      birthyear: 1452,
      artwork_count: 20
    };

    // Insert the example artist into the 'artists' table and store the result
    insertedArtist = await db('artists').insert(exampleArtist).returning('*');

    // Define an example artwork object associated with the inserted artist
    exampleArtwork = {
      title: 'Mona Lisa',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'https://example.com/mona_lisa.jpg',
      location_geohash: 'u4pruydqqw43'
    };
  });

  // Set up afterAll hook to clean up the created artist and destroy the database connection
  afterAll(async () => {
    // Delete the example artist from the 'artists' table
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    // Destroy the database connection
    await db.destroy();
  });

  // Test case: Creating a new artwork successfully
  it('should create a new artwork and return 201 status', async () => {
    // Send a POST request to create a new artwork with the example data
    const response = await request(app)
      .post('/artworks')
      .send(exampleArtwork);

    // Expect a 201 status code
    expect(response.status).toBe(201);

    // Expect the response body to have the 'artwork' property
    expect(response.body).toHaveProperty('artwork');

    // Extract the artwork object from the response
    const artworkResponse = response.body.artwork;

    // Retrieve the artwork record from the database
    const dbRecord = await db('artworks').select('*').where('id', artworkResponse.id);

    // Expect the database record to match the created artwork
    expect(dbRecord[0]).toHaveProperty('id', artworkResponse.id);
    expect(dbRecord[0]).toHaveProperty('title', exampleArtwork.title);
    expect(dbRecord[0]).toHaveProperty('artist_uuid', artworkResponse.artist_uuid);
    expect(dbRecord[0]).toHaveProperty('image_url', exampleArtwork.image_url);
    expect(dbRecord[0]).toHaveProperty('location_geohash', exampleArtwork.location_geohash);
  });

  // Test case: Invalid data format should return a 400 status
  it('should return 400 if data is not formatted correctly', async () => {
    // Define invalid data for the artwork
    const invalidData = {
      title: ')fhfgg',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'testerrr',
      location_geohash: 'awfsadasfasawawsdasdasd'
    };

    // Send a POST request with the invalid data
    const response = await request(app)
      .post('/artworks')
      .send(invalidData);

    // Expect a 400 status code
    expect(response.status).toBe(400);

    // Expect the response body to have the 'message' property
    expect(response.body).toHaveProperty('message', 'Data not formatted correctly');
  });
});