import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

const databaseType: DataSourceOptions['type'] = 'mongodb'
export const DatabaseProvides = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSrouceOptions = {
        type: databaseType,
        url: configService.get<string>('database.url'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [path.join(__dirname, `../../**/*.mongo.entity{.ts,.js}`)],
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize'),
      }
      const ds = new DataSource(dataSrouceOptions)
      await ds.initialize()
      return ds
    },
  },
]
