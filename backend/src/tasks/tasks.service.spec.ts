import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { Priority, TaskStatus } from '@prisma/client';

describe('TasksService', () => {
  let service: TasksService;

  const mockUserId = 'user-123';
  const mockProjectId = 'project-abc';
  const mockTaskId = 'task-xyz';

  const mockProject = {
    id: mockProjectId,
    name: 'Ariadne App',
    ownerId: mockUserId,
    members: [{ userId: 'member-456' }],
  };

  const mockTask = {
    id: mockTaskId,
    title: 'Setup Jest unit tests',
    description: 'Write complete test suite for tasks service',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    dueDate: new Date('2026-09-01'),
    estimatedHours: 4,
    projectId: mockProjectId,
    assigneeId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
    project: mockProject,
  };

  const mockPrismaService = {
    project: {
      findFirst: jest.fn(),
    },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==========================================
  // 1. TESTS: createTask
  // ==========================================
  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'New Task',
      description: 'Description',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: mockProjectId,
      assigneeId: mockUserId,
    };

    it('should create and return a TaskEntity when project exists and user has access', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue(mockProject);
      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result: TaskEntity = await service.createTask(
        createTaskDto,
        mockUserId,
      );

      expect(mockPrismaService.project.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockProjectId,
          OR: [
            { ownerId: mockUserId },
            { members: { some: { userId: mockUserId } } },
          ],
        },
      });
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: createTaskDto.title,
          projectId: mockProjectId,
        }),
      });
      expect(result).toBeInstanceOf(TaskEntity);
    });

    it('should throw NotFoundException if project does not exist or user has no access', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue(null);

      await expect(
        service.createTask(createTaskDto, mockUserId),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.task.create).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // 2. TESTS: getPriorityTasks
  // ==========================================
  describe('getPriorityTasks', () => {
    it('should return a list of priority tasks excluding DONE status', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);

      const result: TaskEntity[] = await service.getPriorityTasks(
        mockUserId,
        5,
      );

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          where: expect.objectContaining({
            status: { notIn: ['DONE'] },
          }),
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(TaskEntity);
    });
  });

  // ==========================================
  // 3. TESTS: getTasksByProjectId
  // ==========================================
  describe('getTasksByProjectId', () => {
    it('should return tasks for a valid project', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue(mockProject);
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);

      const result: TaskEntity[] = await service.getTasksByProjectId(
        mockUserId,
        mockProjectId,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(TaskEntity);
    });

    it('should throw NotFoundException if project is not accessible', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue(null);

      await expect(
        service.getTasksByProjectId(mockUserId, mockProjectId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================
  // 4. TESTS: updateTask
  // ==========================================
  describe('updateTask', () => {
    const updateDto: UpdateTaskDto = {
      title: 'Updated title',
      dueDate: new Date('2026-10-15T00:00:00.000Z'),
    };

    it('should update task when user is the project owner', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated title',
        dueDate: new Date('2026-10-15T00:00:00.000Z'),
      });

      const result: TaskEntity = await service.updateTask(
        mockTaskId,
        mockUserId,
        updateDto,
      );

      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        data: expect.objectContaining({
          title: 'Updated title',
          dueDate: new Date('2026-10-15T00:00:00.000Z'),
        }),
      });
      expect(result).toBeInstanceOf(TaskEntity);
    });

    it('should update task when user is a project member', async () => {
      const memberUserId = 'member-456';
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue(mockTask);

      await service.updateTask(mockTaskId, memberUserId, updateDto);

      expect(mockPrismaService.task.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTask(mockTaskId, mockUserId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user has no relation to project/task', async () => {
      const strangerId = 'stranger-999';
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      await expect(
        service.updateTask(mockTaskId, strangerId, updateDto),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // 5. TESTS: deleteTask
  // ==========================================
  describe('deleteTask', () => {
    it('should delete task when authorized', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      await service.deleteTask(mockUserId, mockTaskId);

      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: mockTaskId },
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.deleteTask(mockUserId, mockTaskId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if unauthorized user attempts deletion', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      await expect(
        service.deleteTask('unauthorized-user', mockTaskId),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.task.delete).not.toHaveBeenCalled();
    });
  });
});
