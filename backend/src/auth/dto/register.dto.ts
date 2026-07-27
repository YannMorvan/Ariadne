import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Le nom d'utilisateur est requis" })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit faire au moins 3 caractères",
  })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  password!: string;
}
