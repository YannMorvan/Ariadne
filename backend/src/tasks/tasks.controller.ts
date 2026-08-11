import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Patch,
  Get,
  ParseIntPipe,
  Query,
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
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get('priority')
  async getPriorityTasks(
    @CurrentUser('id') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.tasksService.getPriorityTasks(userId, limit);
  }

  @Patch()
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.tasksService.updateTask(userId, updateTaskDto);
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
