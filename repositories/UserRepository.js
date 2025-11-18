const User = require('../models/user');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findBySpotifyId(spotifyId) {
    return await User.findOne({ spotifyId });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }
}

module.exports = new UserRepository();
