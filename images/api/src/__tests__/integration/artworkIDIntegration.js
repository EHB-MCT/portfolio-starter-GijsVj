const request = require('supertest');
const app = require('./../../app.js');
const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

const exampleArtwork = {
  id: 1,
  title: 'Mona Lisa',
  artist_uuid: 'cefb6310-8d82-4d7a-b84a-26d18db53819',
  image_url: 'https://example.com/mona_lisa.jpg',
  location_geohash: 'u4pruydqqw43', // Replace with a valid geohash
};
describe('GET /artworks/:id', () => {
    beforeAll(async () => {
        // console.log(db); // Check if db.knex is defined
        const inserted = await db("artworks").insert(exampleArtwork).returning("*");
        exampleArtwork.id = inserted[0].id
      });
      
      afterAll(async () => {
        await db("artworks").del().where({id: exampleArtwork.id})
        await db.destroy();
      });

  it('should return the correct artwork when a valid ID is provided', async () => {
    // Assume you have an artwork with ID 1 in your test data
    const validArtworkId = exampleArtwork.id;

    // Send a GET request to the endpoint
    const response = await request(app).get(`/artworks/${validArtworkId}`);
    // Check the response status
    expect(response.status).toBe(200);

    // Check if the response body contains the expected artwork details
    expect(response.body).toEqual({
      id: validArtworkId,
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
  });
});