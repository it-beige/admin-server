import { Module } from '@nestjs/common'
import { SharedService } from './shared.service'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './configs/module-options'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  exports: [SharedService, ConfigModule],
  providers: [SharedService],
})
export class SharedModule {}
