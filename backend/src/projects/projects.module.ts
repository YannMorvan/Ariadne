import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksService } from '../tasks/tasks.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, TasksService],
})
export class ProjectsModule {}
