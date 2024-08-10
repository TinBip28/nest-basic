import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class company {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsMongoId({ message: 'Role không đúng định dạng' })
  role: mongoose.Schema.Types.ObjectId;

  phone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => company)
  company: company;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({ message: 'không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}
