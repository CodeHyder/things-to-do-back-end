const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rota para listar todas as tarefas
router.get('/tasks', taskController.getAllTasks);

// Rota para criar uma nova tarefa
router.post('/tasks', taskController.createTask);

// Rota para atualizar uma tarefa existente
router.put('/tasks/:id', taskController.updateTask);

// Rota para deletar uma tarefa existente
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
