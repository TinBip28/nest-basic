import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { skip } from 'rxjs';

@Controller('subscribers')
export class SubcribersController {
  constructor(private readonly subcribersService: SubcribersService) {}

  @Post()
  @ResponseMessage('Create a subcriber')
  create(@Body() createSubcriberDto: CreateSubcriberDto, @User() user: IUser) {
    return this.subcribersService.create(createSubcriberDto, user);
  }

  @Post('skills')
  @ResponseMessage("Get subcriber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.subcribersService.getSkills(user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetching api subcribers')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: string,
  ) {
    return this.subcribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetching a subcriber')
  findOne(@Param('id') id: string) {
    return this.subcribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a subcriber')
  update(@Body() updateSubcriberDto: UpdateSubcriberDto, @User() user: IUser) {
    return this.subcribersService.update(updateSubcriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subcriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subcribersService.remove(id, user);
  }
}
