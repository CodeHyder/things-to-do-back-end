const taskController = require('../../controllers/taskController');
const Task = require('../../models/Task');


jest.mock('../../models/Task');

describe('Task Controller', () => {
    const mockReq = { user: { id: 'user123' }, body: {}, params: {} };
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTasks', () => {
        it('Deve retornar todas as tarefas do usuário logado', async () => {
            const tasks = [
                { title: 'Task 1', position: 0 },
                { title: 'Task 2', position: 1 },
            ];
            Task.find.mockReturnValueOnce({
                sort: jest.fn().mockResolvedValueOnce(tasks),
            });

            await taskController.getAllTasks(mockReq, mockRes);

            expect(Task.find).toHaveBeenCalledWith({ user: 'user123' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(tasks);
        });

        it('Deve retornar erro 500 ao falhar', async () => {
            Task.find.mockImplementationOnce(() => {
                throw new Error('Erro ao buscar tarefas');
            });

            await taskController.getAllTasks(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Erro ao buscar tarefas',
                error: expect.any(Error),
            });
        });
    });

    describe('Task Controller - createTask', () => {
        it('Deve criar uma nova tarefa', async () => {
          const mockRequest = {
            user: { id: 'mockUserId' },
            body: { title: 'Nova Tarefa', description: 'Descrição', completed: false },
          };
          const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
       
          Task.findOne = jest.fn(() => ({
            sort: jest.fn(() => ({
              exec: jest.fn().mockResolvedValue(null), // Nenhuma tarefa encontrada
            })),
          }));
          Task.prototype.save = jest.fn().mockResolvedValue({
            _id: 'mockTaskId',
            title: 'Nova Tarefa',
            description: 'Descrição',
            completed: false,
            user: 'mockUserId',
            position: 0,
          });
       
          await taskController.createTask(mockRequest, mockResponse);
    
          expect(mockResponse.status).toHaveBeenCalledWith(201);
          expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            _id: 'mockTaskId',
            title: 'Nova Tarefa',
            description: 'Descrição',
            completed: false,
            user: 'mockUserId',
            position: 0,
          }));
        });
      });
      
    describe('updateTask', () => {
        it('Deve atualizar uma tarefa existente', async () => {
            const updatedTaskData = { title: 'Atualizado', description: 'Descrição atualizada' };
            mockReq.params.id = 'task123';
            mockReq.body = updatedTaskData;

            const mockTask = { save: jest.fn().mockResolvedValueOnce({ ...updatedTaskData, id: 'task123' }) };
            Task.findOne.mockResolvedValueOnce(mockTask);

            await taskController.updateTask(mockReq, mockRes);

            expect(Task.findOne).toHaveBeenCalledWith({ _id: 'task123', user: 'user123' });
            expect(mockTask.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ ...updatedTaskData, id: 'task123' });
        });

        it('Deve retornar 404 se a tarefa não for encontrada', async () => {
            mockReq.params.id = 'task123';
            Task.findOne.mockResolvedValueOnce(null);

            await taskController.updateTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Tarefa não encontrada ou você não tem permissão para alterá-la',
            });
        });
    });

    describe('deleteTask', () => {
        it('Deve deletar uma tarefa existente', async () => {
            mockReq.params.id = 'task123';
            const mockTask = { position: 1 };
            Task.findOneAndDelete.mockResolvedValueOnce(mockTask);
            Task.updateMany.mockResolvedValueOnce();

            await taskController.deleteTask(mockReq, mockRes);

            expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: 'task123', user: 'user123' });
            expect(Task.updateMany).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Tarefa deletada com sucesso',
                task: mockTask,
            });
        });

        it('Deve retornar 404 se a tarefa não for encontrada', async () => {
            mockReq.params.id = 'task123';
            Task.findOneAndDelete.mockResolvedValueOnce(null);

            await taskController.deleteTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Tarefa não encontrada ou você não tem permissão para deletá-la',
            });
        });
    });

    describe('reorderTasks', () => {
        it('Deve reordenar as tarefas', async () => {
            const tasks = [
                { _id: 'task1', position: 1 },
                { _id: 'task2', position: 2 },
            ];
            mockReq.body.tasks = tasks;
            Task.findByIdAndUpdate.mockResolvedValueOnce(tasks[0]).mockResolvedValueOnce(tasks[1]);

            await taskController.reorderTasks(mockReq, mockRes);

            expect(Task.findByIdAndUpdate).toHaveBeenCalledTimes(2);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(tasks);
        });
    });
});
