require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const albumsRoutes = require('./routes/albums');
const userAlbumsRoutes = require('./routes/userAlbums');
const ratingsRoutes = require('./routes/ratings');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);


app.use('/auth', authRoutes);
app.use('/albums', albumsRoutes);
app.use('/user', userAlbumsRoutes);
app.use('/ratings', ratingsRoutes);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

