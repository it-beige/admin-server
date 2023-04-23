import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs'

export const RemoveSensitiveUrls = ['/info']

export class RemoveSensitiveInterceptor implements NestInterceptor {
  constructor(private readonly urls) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const url = req.url
    return next.handle().pipe(
      map((res) => {
        if (!this.urls.includes(url)) return res
        res = JSON.parse(JSON.stringify(res))
        const responseData = res.data || res
        this.delProperty(responseData, 'password')
        this.delProperty(responseData, 'salt')
        return responseData
      }),
    )
  }

  delProperty(data, key) {
    for (const k in data) {
      if (k === key) {
        Reflect.deleteProperty(data, k)
      } else if (typeof k === 'object') {
        this.delProperty(k, key)
      }
    }
  }
}
