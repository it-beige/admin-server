import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SharedService } from '../shared/shared.service'
import { ConfigService } from '@nestjs/config'
import { MongoRepository } from 'typeorm'
import { User } from './entities/user.mongo.entity'
import { AppLogger } from '../shared/logger/logger.services'

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
  create(user) {
    this.logger.log(null, 'created...🚀', {})
    this.logger.debug(null, 'debug:created...🚀', {})
    return this.userRepository.save(user)
  }

  findAll() {
    return this.userRepository.findAndCount()
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
