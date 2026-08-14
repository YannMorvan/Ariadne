import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement authentication system',
    description: 'Title of the task (min 2 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'The task title is required' })
  @MinLength(2, {
    message: 'The title must contain at least 2 characters',
  })
  title!: string;

  @ApiPropertyOptional({
    example: 'Secure the /projects and /tasks endpoints',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Priority,
    default: Priority.MEDIUM,
  })
  @IsEnum(Priority, {
    message: 'The priority must be LOW, MEDIUM, HIGH or URGENT',
  })
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus, {
    message: 'The status must be TODO, IN_PROGRESS, or DONE',
  })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  @IsUUID('4', { message: 'The project ID must be a valid UUID' })
  @IsNotEmpty({ message: 'The project ID is required' })
  projectId!: string;

  @ApiPropertyOptional({ example: '2026-08-15T18:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'The due date must be a valid Date' })
  dueDate?: Date;

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'The estimated hours must be a number' })
  @Min(0, { message: 'Estimated hours cannot be negative' })
  estimatedHours?: number;

  @ApiPropertyOptional({ example: 'user-uuid-1234' })
  @IsUUID('4', { message: 'The assignee ID must be a valid UUID' })
  @IsOptional()
  assigneeId?: string;
}
