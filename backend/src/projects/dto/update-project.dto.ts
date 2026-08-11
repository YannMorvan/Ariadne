import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'The project ID is required' })
  id!: string;
}
