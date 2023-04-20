import { Inject, Injectable } from '@nestjs/common'
import { UpdateUserDto } from '../dtos/update-user.dto'
import { SharedService } from '../../shared/shared.service'
import { ConfigService } from '@nestjs/config'
import { MongoRepository } from 'typeorm'
import { User } from '../entities/user.mongo.entity'
import { AppLogger } from '../../shared/logger/logger.services'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly SharedService: SharedService,
    private readonly ConfigService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(new.target.name)
  }
  /* 
    create: 创建并返回一个新的 User 实例。
    save: 将一个新的或者已存在的 User 实例保存到数据库中。
    delete: 从数据库中删除指定的 User 实例。
    findOne: 根据指定的查询条件返回一个满足条件的 User 实例。
    find: 根据指定的查询条件返回多个满足条件的 User 实例。
    update: 更新数据库中一个已存在的 User 实例的属性值。
  */
  create(user) {
    return this.userRepository.save(user)
  }

  findAll({ page, pageSize }: PaginationParamsDto) {
    // https://typeorm.io/#/find-options
    // findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>
    /* 
      FindManyOptions 包含了多个属性，以下是常用的属性：
      where: 指定查询条件，例如 { name: 'john' } 表示查询 name 为 john 的记录。
      order: 指定排序方式，例如 { name: 'ASC' } 表示按照 name 字段升序排序。
      skip: 指定查询的起始位置（用于分页），例如 10 表示从第 11 条记录开始查询。
      take: 指定查询的记录数量（用于分页），例如 20 表示查询 20 条记录。
      relations: 指定关联查询的实体（使用 TypeORM 中的实体关系）。
      select: 指定查询的字段（属性）列表，例如 [ 'name', 'age' ] 表示只查询 name 和 age 字段。

    */
    return this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    })
  }

  findOne(id: number) {
    return `This action returns a 🚀#${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
