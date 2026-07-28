import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/client';
import {
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
    example: 'Implémenter le Guard JWT',
    description: 'Titre de la tâche (min 2 caractères)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le titre de la tâche est requis' })
  @MinLength(2, {
    message: 'Le titre doit contenir au moins 2 caractères',
  })
  title!: string;

  @ApiPropertyOptional({
    example: 'Sécuriser les endpoints /projects et /tasks',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Priority,
    default: Priority.MEDIUM,
  })
  @IsEnum(Priority, {
    message: 'La priorité doit être LOW, MEDIUM, HIGH ou URGENT',
  })
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus, { message: 'Le statut est invalide' })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  @IsUUID('4', { message: "L'ID du projet doit être un UUID valide" })
  @IsNotEmpty({ message: "L'ID du projet est requis" })
  projectId!: string;

  @ApiPropertyOptional({ example: '2026-08-15T18:00:00.000Z' })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber({}, { message: 'Les heures estimées doivent être un nombre' })
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({ example: 'user-uuid-1234' })
  @IsUUID('4', { message: "L'ID de l'assigné doit être un UUID valide" })
  @IsOptional()
  assigneeId?: string;
}
