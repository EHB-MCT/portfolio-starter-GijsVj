const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid")
const knexfile = require('../../db/knexfile.js');
const db = require("knex")(knexfile.development);

const ARTISTUUID = uuidv4();
const exampleArtwork = {
  id: 1,
  title: 'Mona Lisa',
  artist_uuid: ARTISTUUID,
  image_url: 'https://example.com/mona_lisa.jpg',
  location_geohash: 'u4pruydqqw43'
};

const exampleArtist = {
  uuid: ARTISTUUID,
  artist: 'Leonardo da Vinci',
  birthyear: 1452,  // Note: Use a number instead of a string for numeric values
  artwork_count: 20
};
describe('POST /artworks/:id', () => {
  beforeAll(async () => {
    // Clean up: Delete the test record from the database after the test
    insertedArtist = await db('artists').insert(exampleArtist).returning("*");
    insertedRecord = await db('artworks').insert({...exampleArtwork}).returning("*");
    exampleArtwork.id = insertedRecord[0].id

  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await db('artworks').where({ id: exampleArtwork.id}).del();
    await db('artists').where({uuid: exampleArtist.uuid}).del();
    await db.destroy();
  });

  it('should return the correct artwork when a valid ID is provided', async () => {
    // Send a GET request to the endpoint
    const response = await request(app)
        .post(`/artworks/`)
        .send(exampleArtwork);
    // Check the response status
    const artworkResponse = response.body.artwork
    expect(response.status).toBe(200);
    
    const dbRecord = await db("artworks").select("*").where("id", artworkResponse.id);
    expect(dbRecord[0]).toHaveProperty('id', artworkResponse.id);
    expect(dbRecord[0]).toHaveProperty('title', exampleArtwork.title);
    expect(dbRecord[0]).toHaveProperty('artist_uuid', artworkResponse.artist_uuid);
    expect(dbRecord[0]).toHaveProperty('image_url', exampleArtwork.image_url);
    expect(dbRecord[0]).toHaveProperty('location_geohash', exampleArtwork.location_geohash);
  });

  
  it('should return 401, wrong artwork record', async () => {
    // Send a GET request to the endpoint
    const response = await request(app)
        .post(`/artworks/`)
        .send({
          ...exampleArtwork,
          title: null
      });
    // Check the response status
    expect(response.status).toBe(401);
    
    const dbRecord = await db("artworks").select("*").where("title", null);
    expect(dbRecord.length).toBe(0)
  });
});