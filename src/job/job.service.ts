import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    private companyService: CompaniesService,
  ) {}

  async create(createJobDto: CreateJobDto, @User() user: IUser) {
    const companyExits = await this.companyService.findById(
      createJobDto.company._id.toString(),
    );
    if (!companyExits) {
      throw new BadRequestException('Không tìm thấy công ty');
    }
    let job = await this.jobModel.create({
      ...createJobDto,
      company: {
        _id: createJobDto.company._id,
        name: companyExits.name,
      },
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
    return { _id: job._id, createdAt: job.createdAt };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not Valid id';
    }
    return this.jobModel.findOne({
      _id: id,
    });
  }

  async update(updateJobDto: UpdateJobDto, @User() user: IUser) {
    const updateJob = await this.jobModel.updateOne(
      { _id: updateJobDto._id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return { updateJob, updatedBy: user };
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found';
    }
    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.jobModel.softDelete({ _id: id });
  }
}
