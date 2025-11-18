require('dotenv').config();
const mongoose = require('mongoose');


const mongoUri = process.env.DATABASE_URL;

if (!mongoUri) {
  console.error("❌ A variável DATABASE_URL não foi encontrada no arquivo .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Garante compatibilidade com drivers mais novos
  })
  .then(() => console.log("✅ Conectado ao MongoDB Atlas via Compass!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB Atlas:", err.message));
