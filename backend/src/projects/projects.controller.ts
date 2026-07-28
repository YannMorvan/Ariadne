import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    console.log(
      'Received create project request:',
      createProjectDto,
      'for user:',
      userId,
    );
    return this.projectsService.createProject(createProjectDto, userId);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.getProjectsByUserId(userId);
  }

  @Delete(':id')
  async deleteProject(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    await this.projectsService.deleteProject(userId, projectId);
    return { message: 'Project deleted successfully' };
  }
}
