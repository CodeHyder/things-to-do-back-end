const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors'); // Importar o pacote CORS
  const taskRoutes = require('./routes/taskRoutes');

// Configurações
dotenv.config();
connectDB();

const app = express();
app.use(cors()); 
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
    res.send('API Funcionando!');
  });

app.use('/api', taskRoutes);

// Inicializar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
