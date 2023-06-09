import { Entity, Column } from 'typeorm'
import { Common } from '@/shared/entities/common.mongo.entity'

@Entity()
export class Article extends Common {
  @Column('text')
  title: string

  @Column('text')
  content: string
}
