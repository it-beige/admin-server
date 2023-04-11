import { Module } from '@nestjs/common'
import { SharedService } from './shared.service'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './configs/module-options'
import { DatabaseProvides } from './database.providers'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  exports: [SharedService, ConfigModule, ...DatabaseProvides],
  providers: [SharedService, ...DatabaseProvides],
})
export class SharedModule {}
