import { IsNotEmpty, IsString, Length } from 'class-validator';

export class loginUserInputDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

// todo サービス層まではパスワードを含んだデータを返してそこからパスワードを除外して返すようにする
export class foundUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
