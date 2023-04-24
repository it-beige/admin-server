import { Module } from '@nestjs/common'
import { SharedService } from './shared.service'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './configs/module-options'
import { DatabaseProvides } from './database.providers'
import { AppLoggerModule } from './logger/logger.module'
import { CaptchaService } from './captcha/captcha.service'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  exports: [
    ConfigModule,
    ...DatabaseProvides,
    AppLoggerModule,
    CaptchaService,
    SharedService,
  ],
  providers: [CaptchaService, SharedService, ...DatabaseProvides],
})
export class SharedModule {}
