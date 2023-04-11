import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SharedService } from '../shared/shared.service'
import { ConfigService } from '@nestjs/config'
import { MongoRepository } from 'typeorm'
import { User } from './entities/user.mongo.entity'

@Injectable()
export class UserService {
  constructor(
    private readonly SharedService: SharedService,
    private readonly ConfigService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}
  create(user) {
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
