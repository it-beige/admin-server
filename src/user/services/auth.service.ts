import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongoRepository } from 'typeorm'
import { User } from '../entities/user.mongo.entity'
import { LoginDto } from '../dtos/login.dto'
import { generatePassWord, makeSalt } from '../../shared/utils/cryptogram'
import { AppLogger } from 'src/shared/logger/logger.services'
import { RegisterCodeDTO, RegisterDTO, UserInfoDto } from '../dtos/auth.dto'
import { Role } from '../entities/role.mongo.entity'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { CaptchaService } from '@/shared/captcha/captcha.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: MongoRepository<Role>,
    private readonly logger: AppLogger,
    @InjectRedis() private readonly redis: Redis,
    private readonly captchaService: CaptchaService,
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

  // 生成随机验证码
  generateCode() {
    return Array.from({ length: 4 })
      .map(() => parseInt(Math.random() * 10 + ''))
      .join('')
  }

  async registerCode(register: RegisterCodeDTO) {
    const redisStore = await this.checkVerifyCode()
    if (redisStore !== null) {
      throw new NotFoundException('验证码求过期,请勿重新发送')
    }

    const code = this.generateCode()
    const { phoneNumber } = register
    await this.setVerifyCode(phoneNumber, code)
    return code
  }

  setVerifyCode(phoneNumber, code) {
    return this.redis.set('code', phoneNumber + code, 'EX', 60)
  }

  checkVerifyCode() {
    return this.redis.get('code')
  }

  /**
   * 获取图形验证码
   */
  async getCaptcha() {
    const { data, text } = await this.captchaService.captche()
    const id = makeSalt(8)
    // 验证码存入将Redis
    this.redis.set(`captcha_${id}`, text, 'EX', 60 * 10)
    const image = `data:image/svg+xml;base64,${Buffer.from(data).toString(
      'base64',
    )}`

    return {
      id,
      image,
    }
  }
}
