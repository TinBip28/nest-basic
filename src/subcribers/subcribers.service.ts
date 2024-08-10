import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from './schemas/subcriber.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubcribersService {
  constructor(
    @InjectModel(Subcriber.name)
    private subcriberModel: SoftDeleteModel<SubcriberDocument>,
  ) {}
  async create(createSubcriberDto: CreateSubcriberDto, user: IUser) {
    const { email, name, skills } = createSubcriberDto;
    const isExist = await this.subcriberModel.findOne({
      email: email,
    });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const newSubcriber = await this.subcriberModel.create({
      email,
      name,
      skills,
      createdBy: { _id: user._id, email: user.email },
    });

    return {
      _id: newSubcriber?._id,
      createAt: newSubcriber?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.subcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / +limit);
    const result = await this.subcriberModel
      .find(filter)
      .limit(+limit)
      .skip(offset)
      .sort(sort as any)
      .populate(population)
      .select(projection)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    return await this.subcriberModel.find({ _id: id }).sort('-createdAt');
  }

  async update(updateSubcriberDto: UpdateSubcriberDto, user: IUser) {
    const updated = await this.subcriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubcriberDto,
        updatedBy: { _id: user._id, email: user.email },
      },
      { upsert: true },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    await this.subcriberModel.updateOne({ _id: id }, { deletedBy: user });
    return this.subcriberModel.softDelete({ _id: id });
  }

  async getSkills(user: IUser) {
    const { email } = user;
    return await this.subcriberModel.findOne({ email: email }, { skills: 1 });
  }
}
