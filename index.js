const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database.js');
const cors = require('cors'); 
const taskRoutes = require('./src/routes/taskRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const mongoose = require('mongoose');
/* :) */
dotenv.config();
connectDB();

app = express();
app.use(cors()); 
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API Funcionando!');
  });

app.use('/api', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

process.on('SIGTERM', async () => {
    console.log('\n[SIGTERM] Sinal recebido, desligando servidor...');
     
    await mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada.');

    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});

process.on('SIGINT', async () => { 
    console.log('\nDesligando servidor (SIGINT)...');

    await mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada.');
    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});