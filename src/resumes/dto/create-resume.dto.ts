import { IsEmail, IsMongoId, isNotEmpty, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({ message: 'Email không hợp lệ' })
  email: string;

  @IsMongoId({ message: 'UserId không hợp lệ' })
  @IsNotEmpty({ message: 'UserId không được để trống' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECT';

  @IsNotEmpty({ message: 'JobId không được để trống' })
  jobId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'CompanyId không được để trống' })
  companyId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  @IsMongoId({ message: 'companyId không hợp lệ' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsMongoId({ message: 'jobId không hợp lệ' })
  jobId: mongoose.Schema.Types.ObjectId;
}
