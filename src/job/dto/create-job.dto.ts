import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class company {
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Id công ty không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Vui lòng nhập các kỹ năng yêu cầu' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => company)
  company!: company;

  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ làm việc' })
  location: string;

  @IsNotEmpty({ message: 'Mức lương không được để trống' })
  salary: number;

  @IsNotEmpty({ message: 'Số lượng ứng tuyển ??' })
  quantity: number;

  @IsNotEmpty({ message: 'Nhập level của công việc' })
  level: string;

  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty({ message: 'Trạng thái công việc không được để trống' })
  @IsBoolean()
  isActive: boolean;
}
