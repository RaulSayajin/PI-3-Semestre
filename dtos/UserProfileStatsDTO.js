class UserProfileStatsDTO {
    constructor(totalAvaliacoes, topArtists, topTracks, topAlbums) {
      this.totalAvaliacoes = totalAvaliacoes;
      this.topArtists = topArtists;
      this.topTracks = topTracks;
      this.topAlbums = topAlbums;
    }
  }
  
  module.exports = UserProfileStatsDTO;
  