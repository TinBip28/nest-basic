import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ResponseMessage('create a job')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobService.create(createJobDto, user);
  }

  @ResponseMessage('fetching jobs')
  @Public()
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('get a job')
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @ResponseMessage('update a job')
  @Patch(':id')
  update(@Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobService.update(updateJobDto, user);
  }

  @ResponseMessage('delete a job')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobService.remove(id, user);
  }
}
