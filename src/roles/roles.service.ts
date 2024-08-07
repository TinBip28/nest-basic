import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Mongoose } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    if (await this.roleModel.exists({ name: name })) {
      throw new BadRequestException('Role name already exists');
    }

    let newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return {
      _id: newRole?._id,
      createAt: newRole?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / +limit);
    const result = await this.roleModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role id');
    }
    return (await this.roleModel.findById(id)).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, method: 1, module: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role id');
    }
    const { name, description, isActive, permissions } = updateRoleDto;
    let updatedRole = await this.roleModel.updateOne(
      { _id: id },
      {
        name,
        description,
        isActive,
        permissions,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
    return updatedRole;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role id');
    }
    const deleteRole = await this.roleModel.findById({ _id: id });
    if (deleteRole.name === 'ADMIN') {
      throw new BadRequestException('Cannot delete ADMIN ');
    }

    await this.roleModel.updateOne(
      { _id: id },
      { deteledBy: { _id: user._id, email: user.email } },
    );
    let deletedRole = this.roleModel.softDelete({ _id: id });
    return deletedRole;
  }
}
