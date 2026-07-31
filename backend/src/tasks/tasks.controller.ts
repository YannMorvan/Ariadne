import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('id') userId: string,
  ) {
    console.log(
      'Received create task request:',
      createTaskDto,
      'for user:',
      userId,
    );
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Patch(':id')
  async updateTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(userId, taskId, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    await this.tasksService.deleteTask(userId, taskId);
    return { message: 'Task deleted successfully' };
  }
}
