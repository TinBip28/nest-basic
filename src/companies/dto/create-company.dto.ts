import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company name is required!!!' })
  name: string;

  @IsNotEmpty({ message: 'Address is required!!!' })
  address: string;

  @IsNotEmpty({ message: 'Please put the description!!!' })
  description: string;

  @IsNotEmpty({ message: 'Please upload the logo!!!' })
  logo: string;
}
