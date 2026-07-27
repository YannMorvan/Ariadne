import { ApiProperty } from '@nestjs/swagger';
import { Priority, Project as PrismaProject } from '@prisma/client';

export class ProjectEntity implements PrismaProject {
  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  id!: string;

  @ApiProperty({ example: 'Ariadne MVP' })
  name!: string;

  @ApiProperty({
    example: 'Développement du dashboard et du backend NestJS',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ enum: Priority, example: Priority.MEDIUM })
  priority!: Priority;

  @ApiProperty({ example: '#3b82f6', nullable: true })
  color!: string | null;

  @ApiProperty({ example: 'user-uuid-1234' })
  ownerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
