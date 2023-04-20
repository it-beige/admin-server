import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controllers/user.controller'
import { SharedModule } from '../shared/shared.module'
import { UserProviders } from './user.providers'
import { RoleController } from './controllers/role.controller'
import { RoleService } from './services/role.service'

@Module({
  imports: [SharedModule],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService, ...UserProviders],
})
export class UserModule {}
