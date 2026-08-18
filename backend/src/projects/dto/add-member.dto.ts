import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class AddMemberDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email or username of the user to add to the project',
  })
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty({
    example: 'MEMBER',
    description: 'Role of the member in the project',
  })
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole = ProjectRole.MEMBER;
}
