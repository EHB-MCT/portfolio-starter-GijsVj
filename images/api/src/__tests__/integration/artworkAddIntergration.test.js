const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

let insertedArtist;
let exampleArtwork;
let exampleArtist;

describe('POST /artworks/:id', () => {

  beforeAll(async () => {
    const ARTISTUUID = uuidv4();
    exampleArtist = {
      uuid: ARTISTUUID,
      artist: 'Leonardo da Vinci',
      birthyear: 1452,
      artwork_count: 20
    };

    insertedArtist = await db('artists').insert(exampleArtist).returning('*');

    exampleArtwork = {
      title: 'Mona Lisa',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'https://example.com/mona_lisa.jpg',
      location_geohash: 'u4pruydqqw43'
    };
  });

  afterAll(async () => {
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  it('should create a new artwork and return 201 status', async () => {
    const response = await request(app)
      .post('/artworks')
      .send(exampleArtwork);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('artwork');

    const artworkResponse = response.body.artwork;

    expect(artworkResponse).toHaveProperty('id');

    const dbRecord = await db('artworks').select('*').where('id', artworkResponse.id);

    expect(dbRecord[0]).toHaveProperty('id', artworkResponse.id);
    expect(dbRecord[0]).toHaveProperty('title', exampleArtwork.title);
    expect(dbRecord[0]).toHaveProperty('artist_uuid', artworkResponse.artist_uuid);
    expect(dbRecord[0]).toHaveProperty('image_url', exampleArtwork.image_url);
    expect(dbRecord[0]).toHaveProperty('location_geohash', exampleArtwork.location_geohash);
  });

  it('should return 400 if data is not formatted correctly', async () => {
    const invalidData = {
      title: ')fhfgg',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'testerrr',
      location_geohash: 'awfsadasfasawawsdasdasd'
    };

    const response = await request(app)
      .post('/artworks')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Data not formatted correctly');
  });
});
