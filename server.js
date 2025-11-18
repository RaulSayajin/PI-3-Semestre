require('dotenv').config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  console.error('ERRO: As variáveis de ambiente CLIENT_ID e CLIENT_SECRET não estão definidas.');
  console.error('Por favor, crie um arquivo .env na pasta backend e adicione as suas credenciais do Spotify.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); 

const authRoutes = require('./routes/auth');
const albumsRoutes = require('./routes/albums');
const userAlbumsRoutes = require('./routes/user');
const usuariosRoutes = require('./routes/usuarios');
const artistasRoutes = require('./routes/artistas');
const destaqueRoutes = require('./routes/destaque'); 
const musicasRoutes = require('./routes/musicas');
const avaliacoesRoutes = require('./routes/avaliacoes');

require('./db/db');

const ratingService = require('./core/ratingService');

const app = express();

// ===== ORDEM CORRETA DOS MIDDLEWARES =====

// 1. CORS - SEMPRE PRIMEIRO para permitir credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Session - DEPOIS do CORS
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretdefaultkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true apenas em HTTPS/produção
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  },
  name: 'spotify_session'
}));
const isDev = process.env.NODE_ENV !== 'production';

// 4. Helmet - middlewares de segurança
if (isDev) {
  console.warn('⚠️ Modo DEV detectado: permitindo unsafe-eval temporariamente');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "https://fonts.googleapis.com"],
          styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https://i.scdn.co"],
          connectSrc: ["'self'", "https://api.spotify.com", "https://accounts.spotify.com"],
          objectSrc: ["'none'"],
        },
      },
    })
  );
} else {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "https://fonts.googleapis.com"],
          styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https://i.scdn.co"],
          connectSrc: ["'self'", "https://api.spotify.com", "https://accounts.spotify.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    })
  );
}

// ===== ROTAS =====
app.use('/auth', authRoutes);
app.use('/artistas', artistasRoutes);
app.use('/albums', albumsRoutes);
app.use('/user', userAlbumsRoutes);
app.use('/destaque', destaqueRoutes);
app.use('/musicas', musicasRoutes);  
app.use('/api/avaliacoes', avaliacoesRoutes); 
app.use('/api/usuarios', usuariosRoutes);

// ===== OBSERVER =====
ratingService.on('newRating', (rating) => {
  console.log(`[OBSERVER] Nova avaliação recebida: Álbum ${rating.albumId} recebeu nota ${rating.rating}.`);
});

// ===== ROTA DE TESTE =====
app.get('/test-session', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.json({ 
    message: 'Sessão funcionando!', 
    views: req.session.views,
    sessionID: req.sessionID
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`✅ Frontend esperado em http://localhost:5173`);
});