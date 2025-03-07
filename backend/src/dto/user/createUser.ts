import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class createUserInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class userOutputDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
