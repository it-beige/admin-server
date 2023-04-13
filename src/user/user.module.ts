import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controllers/user.controller'
import { SharedModule } from '../shared/shared.module'
import { UserProviders } from './user.providers'

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
})
export class UserModule {}
