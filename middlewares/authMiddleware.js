
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('[DEBUG] authMiddleware: Cabeçalho de autorização recebido:', authHeader); // DEBUG

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[DEBUG] authMiddleware: Falha - Token não fornecido ou formato incorreto.'); // DEBUG
    return next(new AppError('Token não fornecido.', 401));
  }

  const token = authHeader.split(' ')[1];

  if (!JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET is not defined in environment variables.');
    return next(new AppError('Internal server configuration error.', 500));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[DEBUG] authMiddleware: Token decodificado com sucesso. Payload:', decoded); // DEBUG
    req.user = {
      id: decoded.id,
      email: decoded.email, // se tiver email no payload
      // qualquer outro dado que você colocou no token
    };

    next();
  } catch (err) {
    console.error('[DEBUG] authMiddleware: Falha - Token inválido.', err.message); // DEBUG
    return next(new AppError('Token inválido.', 401));
  }
};

module.exports = authMiddleware;