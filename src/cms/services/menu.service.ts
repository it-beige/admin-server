import { Injectable, Inject } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { Menu } from '../entities/menu.mongo.entity'
import { ArticleService } from './article.service'
import { UploadService } from '@/shared/upload/upload.service'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto'
import { plainToClass } from 'class-transformer'
import { UploadDto } from '@/user/dtos/upload.dto'
import { zip } from 'compressing'
import { existsSync, readdir } from 'fs-extra'
import { extname, join } from 'path'
import { readdirSync } from 'fs'

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

  async import(file: Express.Multer.File, updateDto: UploadDto) {
    const { path: uploadPath } = await this.uploadService.upload(file)
    // const [root] = path.split('.')
    const root = uploadPath.replace(extname(uploadPath), '')
    await zip.uncompress(uploadPath, root)
    const ignoreDir = ['.DS_Store', 'images', 'image']

    const categoryList = (await readdir(root))
      .filter((i) => !ignoreDir.includes(i))
      .filter((i) => existsSync(join(root, i)))

    for (const category of categoryList) {
      // 导入目录(菜单)
      await this.importCategory(category, root)
    }
  }

  async importCategory(category: string, root: string) {
    const categoryDir = (src) => join(root, category, src)
    const articles = readdirSync(join(root, category)).filter((i) =>
      existsSync(categoryDir(i)),
    )
    for (const article of articles) {
      await this.importArticle(article, join(root, article))
    }
  }

  async importArticle(title: string, articleSrc) {
    readdirSync(articleSrc)
  }
}
