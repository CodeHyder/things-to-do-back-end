const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database.js');
const cors = require('cors'); 
const taskRoutes = require('./src/routes/taskRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');


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
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

