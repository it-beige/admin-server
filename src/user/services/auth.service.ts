import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongoRepository } from 'typeorm'
import { User } from '../entities/user.mongo.entity'
import { LoginDto } from '../dtos/login.dto'
import { generatePassWord } from '../../shared/utils/cryptogram'
import { AppLogger } from 'src/shared/logger/logger.services'
import { UserInfoDto } from '../dtos/auth.dto'
import { Role } from '../entities/role.mongo.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: MongoRepository<Role>,
    private readonly logger: AppLogger,
  ) {}

  // 使用jwt签发token
  certificate(user: User) {
    const payload = {
      id: user._id,
    }
    const token = this.jwtService.sign(payload)
    return token
  }

  async checkUserValidity(login: LoginDto) {
    const { phoneNumber, password } = login
    const user = await this.userRepository.findOneBy({ phoneNumber })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const { salt } = user
    const hashPassWord = generatePassWord(salt, password)
    if (user.password !== hashPassWord) {
      throw new NotFoundException('密码错误')
    }

    return user
  }

  // 登录
  async login(login: LoginDto) {
    const user = await this.checkUserValidity(login)
    const token = await this.certificate(user)
    return {
      data: token,
    }
  }

  // 查询用户并获取权限
  async info(id: string) {
    const user = await this.userRepository.findOneBy(id)
    const data: UserInfoDto = Object.assign({}, user)
    if (user.role) {
      const role = await this.roleRepository.findOneBy(user.role)
      if (role) data.permissions = role.permissions
    }

    return data
  }
}
