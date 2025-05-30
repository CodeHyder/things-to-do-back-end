const mongoose = require('mongoose'); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoD B conectado!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1); // Finaliza o processo caso falhe
  }
};

module.exports = connectDB;
