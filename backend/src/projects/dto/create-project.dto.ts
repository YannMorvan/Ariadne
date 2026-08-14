import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Management App',
    description: 'Name of the project (min 2 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'The project name is required' })
  @MinLength(2, {
    message: 'The project name must be at least 2 characters long',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 'A simple project management application',
    description: 'Description of the project',
  })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'MEDIUM',
    description: 'Priority of the project',
  })
  @IsString()
  @IsNotEmpty({ message: 'The project priority is required' })
  priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
