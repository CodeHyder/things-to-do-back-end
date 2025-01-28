const request = require('supertest');
const express = require('express');
const taskRoute = require('../../routes/taskRoutes');  
const taskController = require('../../controllers/taskController');

 
jest.mock('../../middleware/authMiddleware', () => (req, res, next) => next());

 
jest.mock('../../controllers/taskController', () => ({
  getAllTasks: jest.fn((req, res) => res.status(200).json([{ id: 1, title: 'Test Task' }])),
  createTask: jest.fn((req, res) => res.status(201).json({ id: 2, title: req.body.title })),
  reorderTasks: jest.fn((req, res) => res.status(200).send('Tasks reordered')),
  updateTask: jest.fn((req, res) => res.status(200).json({ id: req.params.id, ...req.body })),
  deleteTask: jest.fn((req, res) => res.status(200).send(`Task ${req.params.id} deleted`)),
}));

 
const app = express();
app.use(express.json());
app.use(taskRoute);

describe('Task Routes', () => {
  it('GET /tasks - Deve retornar todas as tarefas', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: 'Test Task' }]);
  });

  it('POST /tasks - Deve criar uma nova tarefa', async () => {
    const newTask = { title: 'New Task' };
    const response = await request(app).post('/tasks').send(newTask);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 2, title: 'New Task' });
  });

  it('PUT /tasks/reorder - Deve reordenar tarefas', async () => {
    const response = await request(app).put('/tasks/reorder').send({ order: [1, 2] });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Tasks reordered');
  });

  it('PUT /tasks/:id - Deve atualizar uma tarefa existente', async () => {
    const updatedTask = { title: 'Updated Task' };
    const response = await request(app).put('/tasks/1').send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', title: 'Updated Task' });
  });

  it('DELETE /tasks/:id - Deve deletar uma tarefa existente', async () => {
    const response = await request(app).delete('/tasks/1');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Task 1 deleted');
  });
});
