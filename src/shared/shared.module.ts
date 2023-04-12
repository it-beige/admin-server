import { Module } from '@nestjs/common'
import { SharedService } from './shared.service'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './configs/module-options'
import { DatabaseProvides } from './database.providers'
import { AppLoggerModule } from './logger/logger.module'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  exports: [SharedService, ConfigModule, ...DatabaseProvides, AppLoggerModule],
  providers: [SharedService, ...DatabaseProvides],
})
export class SharedModule {}
