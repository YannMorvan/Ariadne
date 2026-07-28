import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'The project name is required' })
  @MinLength(2, {
    message: 'The project name must be at least 2 characters long',
  })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'The project description is required' })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'The project priority is required' })
  priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
