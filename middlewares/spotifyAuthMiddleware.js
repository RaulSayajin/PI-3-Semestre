const getBearerToken = require('../utils/getBearerToken');

const spotifyAuthMiddleware = (req, res, next) => {
  const userToken = getBearerToken(req);
  if (!userToken) {
    return res.status(401).json({ error: 'Token inválido ou ausente.' });
  }
  req.userToken = userToken;
  next();
};

module.exports = spotifyAuthMiddleware;
