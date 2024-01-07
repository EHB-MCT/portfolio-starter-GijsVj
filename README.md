# Artwork Library API

The Artwork Library API is a JavaScript-based library designed to connect artists with their artworks.

## Purpose

The Artwork Library API is written in Nodejs and is designed to create a usable library that facilitates the connection between artists and their artworks.

## Getting started

To get started with the project, follow these steps:

### Clone the repository
1. Clone the repository using git
```
git clone https://github.com/EHB-MCT/portfolio-starter-GijsVj.git
```
2. Navigate to the project directory
```
cd portfolio-starter-GijsVj
```


### Prerequisites

Ensure you have the following software installed:

- Docker
- Docker Compose

### Installation

1. Copy the `.env.template` file to `.env`.
2. Run the following command:

   ```
   docker-compose -f docker-compose.dev.yml up --build
   ```
3. your server is running on localhost:80 with /artworks and /artists to see the endpoints
#### Installation test environment

1. Copy the `.env.template` file to `.env`
2. Run the following command:

   ```
   docker-compose -f .\docker-compose.test.yml up --build
   ```
# Artworks Endpoint

The Artwork Library API's Artworks Endpoint provides functionality to manage artworks in the library.

## Create Artwork

Creates a new artwork entry in the 'artworks' table with the provided data.

- **Route:** `POST /`
- **Parameters:**
  - `title` (string): The title of the artwork.
  - `image_url` (string): The URL of the artwork's image.
  - `location_geohash` (string): The geohash representing the location of the artwork.
  - `artist_uuid` (string, optional): Optional artist UUID. If not provided, a new UUID will be generated.
- **Responses:**
  - `201`: The newly created artwork object.
  - `400`: A message indicating that the provided data is not formatted correctly.
  - `500`: An error object if the operation fails.

## Get All Artworks

Retrieves a list of all artworks from the 'artworks' table in the database.

- **Route:** `GET /`
- **Responses:**
  - `200`: An array of artwork objects.
  - `500`: An error object if the operation fails.

## Get Artwork by ID

Retrieves an artwork from the 'artworks' table based on the provided ID.

- **Route:** `GET /:id`
- **Parameters:**
  - `id` (number): The ID of the artwork to retrieve.
- **Responses:**
  - `200`: The requested artwork object.
  - `404`: An error object indicating that the artwork was not found.
  - `400`: An error object indicating that an invalid ID was provided.
  - `500`: An error object if the operation fails.

## Update Artwork by ID

Updates an existing artwork in the 'artworks' table based on the provided ID.

- **Route:** `PUT /:artworkId`
- **Parameters:**
  - `artworkId` (number): The ID of the artwork to update.
  - `title` (string): The updated title of the artwork.
  - `image_url` (string): The updated URL of the artwork's image.
  - `location_geohash` (string): The updated geohash representing the location of the artwork.
- **Responses:**
  - `200`: The updated artwork object.
  - `404`: An error object indicating that the artwork was not found.
  - `400`: A message indicating that the provided data is not formatted correctly.
  - `500`: An error object if the operation fails.

## Delete Artwork by ID

Deletes an artwork from the 'artworks' table based on the provided ID.

- **Route:** `DELETE /:id`
- **Parameters:**
  - `id` (number): The ID of the artwork to delete.
- **Responses:**
  - `204`: No content, indicating successful deletion.
  - `404`: An error object indicating that the artwork was not found.
  - `500`: An error object if the operation fails.

---

# Artists Endpoint

The Artwork Library API's Artists Endpoint provides functionality to manage artists in the library.

## Create Artist

Creates a new artist in the 'artists' table in the database.

- **Route:** `POST /`
- **Parameters:**
  - `artist` (string): The name of the artist.
  - `birthyear` (number): The birth year of the artist.
  - `artwork_count` (number): The count of artworks by the artist.
- **Responses:**
  - `201`: A success message and the created artist object.
  - `400`: An error object if the request data is not formatted correctly.
  - `500`: An error object if the operation fails.

## Get All Artists

Retrieves a list of all artists from the 'artists' table in the database.

- **Route:** `GET /`
- **Responses:**
  - `200`: An array of artist objects.
  - `500`: An error object if the operation fails.

## Get Artist by UUID

Retrieves an artist from the 'artists' table by UUID.

- **Route:** `GET /:uuid`
- **Parameters:**
  - `uuid` (string): The UUID of the artist to retrieve.
- **Responses:**
  - `200`: The artist object.
  - `400`: An error object if the provided UUID is invalid.
  - `404`: An error object if the artist is not found.
  - `500`: An error object if the operation fails.

## Update Artist

Updates an existing artist in the 'artists' table by UUID.

- **Route:** `PUT /:uuid`
- **Parameters:**
  - `uuid` (string): The UUID of the artist to update.
  - `artist` (string): The updated name of the artist.
  - `birthyear` (number): The updated birth year of the artist.
  - `artwork_count` (number): The updated count of artworks by the artist.
- **Responses:**
  - `200`: A success message.
  - `400`: An error object if the request data is not formatted correctly.
  - `500`: An error object if the operation fails.

## Delete Artist

Deletes an existing artist in the 'artists' table by UUID.

- **Route:** `DELETE /:uuid`
- **Parameters:**
  - `uuid` (string): The UUID of the artist to delete.
- **Responses:**
  - `204`: A success message.
  - `400`: An error object if the provided UUID is invalid.
  - `404`: An error object if the artist is not found.
  - `500`: An error object if the operation fails.

---

## License

This project is licensed under the [MIT License](LICENSE).

## Questions and Support

    If you have any questions or need assistance, feel free to open a support ticket.