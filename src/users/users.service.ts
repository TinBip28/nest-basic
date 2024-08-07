import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schemas';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
    private companyService: CompaniesService,
  ) {}

  hashPassword(password: string) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    const companyExits = await this.companyService.findById(
      createUserDto.company._id.toString(),
    );
    if (!companyExits) {
      throw new BadRequestException('Không tìm thấy công ty');
    }
    if (isExist) {
      throw new BadRequestException('Email này đã được sử dụng');
    }
    const hashedPassword = this.hashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      company: {
        _id: createUserDto.company._id,
        name: companyExits.name,
      },
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / +limit);
    const result = await this.userModel
      .find(filter)
      .limit(+limit)
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
    return this.userModel
      .findOne({
        _id: id,
      })
      .select('-password')
      .populate({
        path: 'role',
        select: { _id: 1, name: 1 },
      });
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({
        path: 'role',
        select: { _id: 1, name: 1, permissions: 1 },
      });
  }

  findUserToken(refreshToken: string) {
    return this.userModel.findOne({
      refreshToken,
    });
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto, @User() user: IUser) {
    updateUserDto.password = this.hashPassword(updateUserDto.password);
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updateUser;
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found';
    }
    if (user._id === id) {
      throw new BadRequestException('Không thể xóa chính mình');
    }
    const userDelete = await this.userModel.findOne({ _id: id });
    if (userDelete.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa admin');
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }

  async register(user: RegisterDto) {
    const isExist = await this.userModel.findOne({ email: user.email });
    if (isExist) {
      throw new BadRequestException('Email này đã được sử dụng');
    }
    const hashedPassword = this.hashPassword(user.password);
    let newUser = await this.userModel.create({
      ...user,
      role: 'USER',
      password: hashedPassword,
    });
    return { _id: newUser._id, email: newUser.email };
  }

  async updateUserToken(refreshToken: string, _id: string) {
    return this.userModel.updateOne({ _id: _id }, { refreshToken });
  }
}
