import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required!!!' })
  name: string;

  @IsNotEmpty({ message: 'Email is required!!!' })
  @IsEmail({}, { message: 'không đúng định dạng' })
  email: string;

  @IsNotEmpty()
  password: string;
  age: number;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
