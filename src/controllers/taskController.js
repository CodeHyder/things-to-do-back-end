const Task = require('../models/Task');


exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId }).sort({ position: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    const lastTask = await Task.findOne({ user: req.user.id })
      .sort({ position: -1 })
      .exec();

      const newPosition = lastTask && lastTask.position !== undefined ? lastTask.position + 1 : 0;

    const newTask = new Task({
      title,
      description,
      completed,
      user: req.user.id,
      position: newPosition,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar a tarefa', error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;


    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para alterá-la' });
    }


    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar a tarefa', error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para deletá-la' });
    }

    const deletedPosition = deletedTask.position;

    await Task.updateMany(
      { user: req.user.id, position: { $gt: deletedPosition } },
      { $inc: { position: -1 } }
    );

    res.status(200).json({ message: 'Tarefa deletada com sucesso', task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar a tarefa', error });
  }
};

exports.reorderTasks = async (req, res) => {
  const { tasks } = req.body;  

  try {
     
    const updatePromises = tasks.map(task =>
      Task.findByIdAndUpdate(task._id, { position: task.position }, { new: true })
    );

    const updatedTasks = await Promise.all(updatePromises);

    res.status(200).json(updatedTasks);
  } catch (error) {
    console.error('Erro ao reordenar tarefas:', error);
    res.status(500).json({ message: 'Erro ao reordenar tarefas.' });
  }
};