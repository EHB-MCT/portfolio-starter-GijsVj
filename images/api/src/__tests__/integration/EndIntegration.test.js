const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

describe('Artwork End-to-End Tests', () => {
  let insertedArtist;
  let insertedRecord;
  let exampleArtwork;
  let exampleArtist;

  beforeAll(async () => {
    try {
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        artwork_count: 20,
      };

      insertedArtist = await db('artists').insert(exampleArtist).returning('*');

      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43',
      };

      insertedRecord = await db('artworks').insert({ ...exampleArtwork }).returning('*');
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  describe('Artwork CRUD operations', () => {
    it('should retrieve a specific artwork via GET /artworks/:id', async () => {
      const response = await request(app).get(`/artworks/${exampleArtwork.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(exampleArtwork);
    });

    it('should add a new artwork via POST /artworks', async () => {
      const newArtwork = {
        title: 'New Artwork',
        artist_uuid: exampleArtist.uuid,
        image_url: 'https://example.com/new_artwork.jpg',
        location_geohash: 'u4pruydqqw44',
      };
    
      const postResponse = await request(app).post('/artworks').send(newArtwork);
    
        expect(postResponse.status).toBe(201);
    
        const addedArtworkId = postResponse.body.artwork.id;
    
        const getResponse = await request(app).get(`/artworks/${addedArtworkId}`);

        const expectedArtwork = {
          id: addedArtworkId,
          title: 'New Artwork',
          artist_uuid: exampleArtist.uuid,
          image_url: 'https://example.com/new_artwork.jpg',
          location_geohash: 'u4pruydqqw44',
        };
    
        expect(getResponse.status).toBe(200)
        expect(getResponse.body).toEqual(expectedArtwork);
    });

    it('should update an existing artwork via PUT /artworks/:id', async () => {
      const updatedArtwork = {
        title: 'Updated Artwork',
        artist_uuid: exampleArtist.uuid,
        image_url: 'https://example.com/updated_artwork.jpg',
        location_geohash: 'u4pruydqqw45',
      };

      const putResponse = await request(app).put(`/artworks/${exampleArtwork.id}`).send(updatedArtwork);
      expect(putResponse.status).toBe(200);

      const getResponse = await request(app).get(`/artworks/${exampleArtwork.id}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual({ ...updatedArtwork, id: exampleArtwork.id });
    });

    it('should delete an existing artwork via DELETE /artworks/:id', async () => {
      const deleteResponse = await request(app).delete(`/artworks/${exampleArtwork.id}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/artworks/${exampleArtwork.id}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Artist CRUD operations', () => {
    it('should retrieve a specific artist via GET /artists/:uuid', async () => {
      const response = await request(app).get(`/artists/${exampleArtist.uuid}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(exampleArtist);
    });

    it('should add a new artist via POST /artists', async () => {
      const newArtist = {
        artist: 'New Artist',
        birthyear: 2000,
        artwork_count: 10,
      };

      const postResponse = await request(app).post('/artists').send(newArtist);
      expect(postResponse.status).toBe(201);

      const addedArtistUuid = postResponse.body.artist.uuid;
      const getResponse = await request(app).get(`/artists/${addedArtistUuid}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual({ uuid: addedArtistUuid, ...newArtist });
    });

    it('should update an existing artist via PUT /artists/:uuid', async () => {
      const updatedArtist = { ...insertedArtist[0], artist: 'Picasso' };
      const response = await request(app).put(`/artists/${exampleArtist.uuid}`).send(updatedArtist);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Artist updated successfully');
    });

    it('should delete an existing artist via DELETE /artists/:uuid', async () => {
      const deleteResponse = await request(app).delete(`/artists/${exampleArtist.uuid}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/artists/${exampleArtist.uuid}`);
      expect(getResponse.status).toBe(404);
    });
  });
});