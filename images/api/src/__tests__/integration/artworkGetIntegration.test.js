const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

/**
 * Get Artwork by ID
 *
 * Retrieves an artwork from the 'artworks' table in the database based on the provided ID.
 *
 * @route GET /artworks/:id
 * @param {number} id.path.required - The ID of the artwork to retrieve.
 * @returns {Object} 200 - The artwork object corresponding to the provided ID.
 * @returns {Object} 404 - Not Found. Indicates that the artwork with the provided ID was not found.
 * @returns {Object} 400 - Bad Request. Indicates an invalid or malformed request.
 * @returns {Object} 500 - An error object if the operation fails.
 * @name GetArtworkById
 * @function
 */
let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('GET /artworks/:id', () => {
  /**
   * Set up test data
   */
  beforeAll(async () => {
    try {
      // Inserting an example artist record
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20
      };
      insertedArtist = await db('artists').insert(exampleArtist).returning("*");

      // Inserting an example artwork record associated with the artist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };
      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * Clean up test data
   */
  afterAll(async () => {
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  /**
   * Test case: Get artwork by valid ID
   */
  it('should return the correct artwork when a valid ID is provided', async () => {
    const validArtworkId = exampleArtwork.id;

    const response = await request(app).get(`/artworks/${validArtworkId}`);
    expect(response.status).toBe(200);

    const dbRecord = await db("artworks").select("*").where("id", validArtworkId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id', validArtworkId);

    expect(response.body).toEqual({
      id: validArtworkId,
      artist_uuid: exampleArtwork.artist_uuid,
      image_url: exampleArtwork.image_url,
      location_geohash: exampleArtwork.location_geohash,
      title: exampleArtwork.title
    });
  });

  /**
   * Test case: Get artwork by invalid ID
   */
  it('should return a 404 status when an invalid ID is provided', async () => {
    const invalidArtworkId = 99999;

    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(404);

    const dbRecord = await db("artworks").select("*").where("id", invalidArtworkId);
    expect(dbRecord.length).toBe(0);
  });

  /**
   * Test case: Get artwork by negative ID
   */
  it('should return a 400 status when a negative ID is provided', async () => {
    const invalidArtworkId = -12;

    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(400);
  });

  /**
   * Test case: Get artwork by string ID
   */
  it('should return a 400 status when a string is provided', async () => {
    const invalidArtworkId = 'hello';

    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(400);
  });

  /**
   * Test case: Get artwork by too large ID
   */
  it('should return a 400 status when too large id is provided', async () => {
    const invalidArtworkId = 9999999;

    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(400);
  });
});

