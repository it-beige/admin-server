import { User } from './entities/user.mongo.entity'
import { Role } from './entities/role.mongo.entity'
import { ConfigService } from '@nestjs/config'

export type UPLOAD_TYPE = {
  path: string
}

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(User),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Role),
    inject: ['MONGODB_DATA_SOURCE'],
  },
]
