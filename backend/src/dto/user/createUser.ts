import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class UserOutputDto {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}