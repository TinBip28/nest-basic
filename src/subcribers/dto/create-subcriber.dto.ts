import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubcriberDto {
  @IsEmail({ message: 'Phải nhập đúng định dạng email' })
  @IsNotEmpty({ message: 'Không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Không được để trống tên' })
  name: string;

  @IsArray({ message: 'Kỹ năng phải là một mảng' })
  @IsNotEmpty({ message: 'Không được để trống kỹ năng' })
  @IsString({ each: true, message: 'Mỗi kĩ năng phải là một chuỗi' })
  skills: string[];
}
