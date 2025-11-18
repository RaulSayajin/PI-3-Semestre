const browse = require('./browse');
const artists = require('./artists');
const albums = require('./albums');
const tracks = require('./tracks');
const user = require('./userService');
const recommendations = require('./recommendations');

module.exports = {
  ...browse,
  ...artists,
  ...albums,
  ...tracks,
  ...user,
  ...recommendations,
};