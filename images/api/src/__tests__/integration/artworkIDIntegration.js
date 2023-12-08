const request = require('supertest');
const app = require('./../../app.js');
const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

const exampleArtwork = {
  id: 1,
  title: 'Mona Lisa',
  artist_uuid: 'cefb6310-8d82-4d7a-b84a-26d18db53819',
  image_url: 'https://example.com/mona_lisa.jpg',
  location_geohash: 'u4pruydqqw43'
};

/* const exampleArtist = {
  uuid: 'cefb6310-8d82-4d7a-b84a-26d18db53819',
  artist: 'Leonardo da Vinci',
  birthyear: '1452',
  artwork_count: '20'
}; */
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
    expect(dbRecord).toBeGreaterThan(0);
    expect(dbRecord).toHaveProperty('id', validArtworkId);

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
    expect(dbRecord).toBeGreaterThan(0);
  });

  it('should return a 401 status when a negative ID is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = -12;
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(401);
  });

  it('should return a 401 status when a negative ID is provided', async () => {
    // Assume there is no artwork with ID 999 in your test data
    const invalidArtworkId = 'hello';
    

    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);

    // Check the response status
    expect(response.status).toBe(401);
  });
});