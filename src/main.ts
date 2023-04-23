import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { generateDocument } from './doc'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { getUploadDir } from './shared/utils/upload'
import {
  RemoveSensitiveInterceptor,
  RemoveSensitiveUrls,
} from './shared/interceptors/remove-sensitive.interceptor'

async function bootstrap() {
  // 修改运行平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 静态服务
  const uploadDir = getUploadDir(process.env.UPLOAD_PATH)
  app.useStaticAssets(uploadDir, {
    prefix: '/static/upload',
  })
  // 允许不能识别的值
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  )
  // 添加全局管道
  app.useGlobalPipes(new ValidationPipe())

  // 使用全局拦截器处理敏感数据
  app.useGlobalInterceptors(new RemoveSensitiveInterceptor(RemoveSensitiveUrls))

  // 生成swagger文档
  generateDocument(app)
  await app.listen(3000)
}
bootstrap()
