import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { generateDocument } from './doc'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  // 修改运行平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 允许不能识别的值
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  )
  // 添加全局管道
  app.useGlobalPipes(new ValidationPipe())
  // 生成swagger文档
  generateDocument(app)
  await app.listen(3000)
}
bootstrap()
