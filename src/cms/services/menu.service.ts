import { Injectable, Inject } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { Menu } from '../entities/menu.mongo.entity'
import { ArticleService } from './article.service'
import { UploadService } from '@/shared/upload/upload.service'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto'
import { plainToClass } from 'class-transformer'

@Injectable()
export class MenuService {
  constructor(
    @Inject('MENU_REPOSITORY')
    private MenuRepository: MongoRepository<Menu>,
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: MongoRepository<Menu>,
    private articleService: ArticleService,
    private uploadService: UploadService,
  ) {}

  async update(menus: UpdateMenuDto) {
    const { upsertedId } = await this.MenuRepository.updateOne(
      {},
      { $set: menus },
      { upsert: true },
    )
    return upsertedId
      ? await this.MenuRepository.findOneBy(upsertedId._id.toHexString())
      : null
  }

  async find(): Promise<{ data: object }> {
    const data = await this.MenuRepository.findOneBy({})
    data && delete data._id
    return {
      data: data ? data : { menus: {} },
    }
  }
}
