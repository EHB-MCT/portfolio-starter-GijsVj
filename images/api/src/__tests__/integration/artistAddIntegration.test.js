const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

let insertedArtist;
let exampleArtist;

describe('POST /artists/:uuid', () => {
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

  it('should create a new artist and return 200 status', async () => {
      // Send a POST request to the endpoint with the artist data
      const response = await request(app)
        .post('/artists')
        .send(exampleArtist);
  
      // Check the response status
      expect(response.status).toBe(200);
  
      // Ensure that the response body has the expected structure
      expect(response.body).toBeTruthy(); // Check if the response body is truthy
      
      // Fetch the artist from the database using the UUID
      const dbRecord = await db("artists").select("*").where("uuid", exampleArtist.uuid);
      
      // Check the properties of the fetched artist
      expect(dbRecord[0]).toHaveProperty('uuid', exampleArtist.uuid);
      expect(dbRecord[0]).toHaveProperty('artist', exampleArtist.artist);
      expect(dbRecord[0]).toHaveProperty('birthyear', exampleArtist.birthyear);
      expect(dbRecord[0]).toHaveProperty('artwork_count', exampleArtist.artwork_count);
  });

  it('should return 401 for invalid artist data', async () => {
    // Send a POST request to the endpoint with invalid artist data
    const response = await request(app)
      .post('/artists')
      .send({ invalidField: 'Invalid Data' });

    // Check the response status
    expect(response.status).toBe(401);
  });

});