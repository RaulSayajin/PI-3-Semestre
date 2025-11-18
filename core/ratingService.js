const EventEmitter = require('events');

class RatingService extends EventEmitter {
  constructor() {
    super();
    this.ratingsByAlbum = new Map();
  }

  addRating(albumId, rating, userId = null) {
    if (!albumId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Error('Dados inválidos para avaliação');
    }

    const newRating = { albumId, rating, userId, timestamp: Date.now() };

    if (!this.ratingsByAlbum.has(albumId)) {
      this.ratingsByAlbum.set(albumId, []);
    }
    this.ratingsByAlbum.get(albumId).push(newRating);
    this.emit('newRating', newRating);

    return newRating;
  }

  getRatingsForAlbum(albumId) {
    return this.ratingsByAlbum.get(albumId) || [];
  }
}

module.exports = new RatingService(); 
