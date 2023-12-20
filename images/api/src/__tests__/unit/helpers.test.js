
const {checkArtworkTitle} = require("../../helpers/endpointHelpers.js");

/* 
table.increments('id').primary();
table.string('title');
table.string('artist_uuid');
table.string('image_url');
table.string('location_geohash').notNullable(); */

test('check title', () =>{

    expect(checkArtworkTitle("")).toBe(false);
    expect(checkArtworkTitle(null)).toBe(false);
    expect(checkArtworkTitle("i")).toBe(false);
    expect(checkArtworkTitle(1)).toBe(false);
    expect(checkArtworkTitle(false)).toBe(false);
    expect(checkArtworkTitle(undefined)).toBe(false);
    expect(checkArtworkTitle("fdfgsrgsdhdshsergskflghsldghsghsd;gjslfgdsfhlghsdsdjhfgsghdkfghdfkgjhsfkghfgjhkfhgkfghfghksfhdskjshdg")).toBe(false);

    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("de schreeuw")).toBe(true);
})