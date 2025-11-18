const { getUserTopArtists, getRecommendations } = require('../services');

/**
 * @interface RecommendationStrategy
 * Interface para uma estratégia de recomendação.
 * Deve implementar o método getSeeds(userToken).
 */

/**
 * Estratégia de recomendação baseada nos top artistas do usuário.
 * @implements {RecommendationStrategy}
 */
class TopArtistsStrategy {
  constructor(limit = 2) {
    this.limit = limit;
  }

  async getSeeds(userToken) {
    const topArtists = await getUserTopArtists(userToken, { limit: this.limit });
    if (!topArtists || topArtists.length === 0) {
      return {};
    }
    return { seed_artists: topArtists.map(artist => artist.id) };
  }
}

/**
 * Contexto que utiliza uma estratégia para gerar recomendações.
 */
class RecommendationGenerator {
  /**
   * @param {RecommendationStrategy} strategy
   */
  constructor(strategy) {
    if (typeof strategy.getSeeds !== 'function') {
      throw new Error('Strategy must have a getSeeds method.');
    }
    this.strategy = strategy;
  }

  async generate(userToken) {
    const seeds = await this.strategy.getSeeds(userToken);
    return getRecommendations(seeds);
  }
}

module.exports = { RecommendationGenerator, TopArtistsStrategy };
