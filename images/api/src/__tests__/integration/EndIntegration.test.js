const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * Artwork End-to-End Tests
 *
 * This set of tests covers CRUD operations for artworks and artists in the application.
 *
 * @route /artworks
 * @group Artwork
 * @name ArtworkTests
 */
describe('Artwork End-to-End Tests', () => {
  let insertedArtist;
  let insertedRecord;
  let exampleArtwork;
  let exampleArtist;

  /**
   * Setup before running Artwork End-to-End Tests
   *
   * Initializes necessary data for the tests, including an example artist and artwork.
   *
   * @function
   * @name beforeAll
   * @inner
   */
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

  /**
   * Clean up after running Artwork End-to-End Tests
   *
   * Deletes the example artwork and artist created during setup.
   *
   * @function
   * @name afterAll
   * @inner
   */
  afterAll(async () => {
    await db('artworks').where({ id: exampleArtwork.id }).del();
    await db('artists').where({ uuid: exampleArtist.uuid }).del();
    await db.destroy();
  });

  /**
   * Artwork CRUD operations
   *
   * Tests for Create, Read, Update, and Delete operations on artworks.
   *
   * @route /artworks
   * @group Artwork
   * @name ArtworkCRUD
   */
  describe('Artwork CRUD operations', () => {
    /**
     * Retrieve a specific artwork via GET /artworks/:id
     *
     * @route GET /artworks/{id}
     * @returns {Object} 200 - The retrieved artwork object.
     * @returns {Object} 404 - Not Found if the artwork is not found.
     * @name GetArtworkById
     * @function
     */
    it('should retrieve a specific artwork via GET /artworks/:id', async () => {
      const response = await request(app).get(`/artworks/${exampleArtwork.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(exampleArtwork);
    });

    /**
     * Add a new artwork via POST /artworks
     *
     * @route POST /artworks
     * @consumes application/json
     * @param {Object} requestBody.body.required - The new artwork details.
     * @returns {Object} 201 - The created artwork object.
     * @returns {Object} 400 - Bad Request if the request is invalid.
     * @name AddNewArtwork
     * @function
     */
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

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(expectedArtwork);
    });

    /**
     * Update an existing artwork via PUT /artworks/:id
     *
     * @route PUT /artworks/{id}
     * @consumes application/json
     * @param {Object} requestBody.body.required - The updated artwork details.
     * @returns {Object} 200 - The updated artwork object.
     * @returns {Object} 400 - Bad Request if the request is invalid.
     * @returns {Object} 404 - Not Found if the artwork is not found.
     * @name UpdateArtwork
     * @function
     */
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

    /**
     * Delete an existing artwork via DELETE /artworks/:id
     *
     * @route DELETE /artworks/{id}
     * @returns {Object} 204 - No Content if the artwork is successfully deleted.
     * @returns {Object} 404 - Not Found if the artwork is not found.
     * @name DeleteArtwork
     * @function
     */
    it('should delete an existing artwork via DELETE /artworks/:id', async () => {
      const deleteResponse = await request(app).delete(`/artworks/${exampleArtwork.id}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/artworks/${exampleArtwork.id}`);
      expect(getResponse.status).toBe(404);
    });
  });

  /**
   * Artist CRUD operations
   *
   * Tests for Create, Read, Update, and Delete operations on artists.
   *
   * @route /artists
   * @group Artist
   * @name ArtistCRUD
   */
  describe('Artist CRUD operations', () => {
    /**
     * Retrieve a specific artist via GET /artists/:uuid
     *
     * @route GET /artists/{uuid}
     * @returns {Object} 200 - The retrieved artist object.
     * @returns {Object} 404 - Not Found if the artist is not found.
     * @name GetArtistByUuid
     * @function
     */
    it('should retrieve a specific artist via GET /artists/:uuid', async () => {
      const response = await request(app).get(`/artists/${exampleArtist.uuid}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(exampleArtist);
    });

    /**
     * Add a new artist via POST /artists
     *
     * @route POST /artists
     * @consumes application/json
     * @param {Object} requestBody.body.required - The new artist details.
     * @returns {Object} 201 - The created artist object.
     * @returns {Object} 400 - Bad Request if the request is invalid.
     * @name AddNewArtist
     * @function
     */
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
      await db('artists').where({ uuid: addedArtistUuid }).del();
    });

    /**
     * Update an existing artist via PUT /artists/:uuid
     *
     * @route PUT /artists/{uuid}
     * @consumes application/json
     * @param {Object} requestBody.body.required - The updated artist details.
     * @returns {Object} 200 - Success message if the artist is updated.
     * @returns {Object} 400 - Bad Request if the request is invalid.
     * @returns {Object} 404 - Not Found if the artist is not found.
     * @name UpdateArtist
     * @function
     */
    it('should update an existing artist via PUT /artists/:uuid', async () => {
      const updatedArtist = { ...insertedArtist[0], artist: 'Picasso' };
      const response = await request(app).put(`/artists/${exampleArtist.uuid}`).send(updatedArtist);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Artist updated successfully');
    });

    /**
     * Delete an existing artist via DELETE /artists/:uuid
     *
     * @route DELETE /artists/{uuid}
     * @returns {Object} 204 - No Content if the artist is successfully deleted.
     * @returns {Object} 404 - Not Found if the artist is not found.
     * @name DeleteArtist
     * @function
     */
    it('should delete an existing artist via DELETE /artists/:uuid', async () => {
      const deleteResponse = await request(app).delete(`/artists/${exampleArtist.uuid}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/artists/${exampleArtist.uuid}`);
      expect(getResponse.status).toBe(404);
    });
  });
});