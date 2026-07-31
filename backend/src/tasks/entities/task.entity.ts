import { ApiProperty } from '@nestjs/swagger';
import { Priority, TaskStatus, Task as PrismaTask } from '@prisma/client';

export class TaskEntity implements PrismaTask {
  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  id!: string;

  @ApiProperty({ example: 'Implement authentication' })
  title!: string;

  @ApiProperty({
    example: 'Implement JWT authentication for the API',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status!: TaskStatus;

  @ApiProperty({ enum: Priority, example: Priority.MEDIUM })
  priority!: Priority;

  @ApiProperty({ example: '2026-08-15T18:00:00.000Z', nullable: true })
  dueDate!: Date | null;

  @ApiProperty({ example: 4.5, nullable: true })
  estimatedHours!: number | null;

  @ApiProperty({ example: 2.0, nullable: true })
  loggedHours!: number | null;

  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  projectId!: string;

  @ApiProperty({ example: 'user-uuid-1234', nullable: true })
  assigneeId!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
