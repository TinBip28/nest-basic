import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { CompaniesModule } from 'src/companies/companies.module';
import { Role, RoleSchema } from 'src/roles/schemas/role.schemas';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    CompaniesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
