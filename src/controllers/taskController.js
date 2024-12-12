const Task = require('../models/Task');

// Função para listar todas as tarefas
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();  // Buscar todas as tarefas no banco
    res.status(200).json(tasks);  // Retornar as tarefas com status 200 (OK)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error });  // Retornar erro em caso de falha
  }
};

// Função para criar uma nova tarefa
exports.createTask = async (req, res) => {
    try {
      const { title, description, completed } = req.body;
  
      // Validar se o título foi fornecido
      if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
      }
  
      // Criar a nova tarefa
      const newTask = new Task({
        title,
        description,
        completed,
      });
  
      // Salvar a tarefa no banco de dados
      const savedTask = await newTask.save();
  
      // Retornar a tarefa salva com status 201 (Criado)
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar a tarefa', error });
    }
  };

  // Função para atualizar uma tarefa
exports.updateTask = async (req, res) => {
    try {
      const { id } = req.params; // Obtemos o ID da tarefa da URL
      const { title, description, completed } = req.body;
  
      // Buscar a tarefa no banco de dados pelo ID
      const task = await Task.findById(id);
  
      // Verificar se a tarefa foi encontrada
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
  
      // Atualizar os campos da tarefa
      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed !== undefined ? completed : task.completed;
  
      // Salvar a tarefa atualizada no banco de dados
      const updatedTask = await task.save();
  
      // Retornar a tarefa atualizada
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a tarefa', error });
    }
  };

  // Função para deletar uma tarefa
exports.deleteTask = async (req, res) => {
    try {
      const { id } = req.params; // Obtemos o ID da tarefa da URL
  
      // Buscar e deletar a tarefa no banco de dados
      const deletedTask = await Task.findByIdAndDelete(id);
  
      // Verificar se a tarefa foi encontrada e deletada
      if (!deletedTask) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }
  
      // Retornar a resposta confirmando a exclusão
      res.status(200).json({ message: 'Tarefa deletada com sucesso', task: deletedTask });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar a tarefa', error });
    }
  };