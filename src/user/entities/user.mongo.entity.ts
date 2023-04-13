import { Column, Entity } from 'typeorm'
import { Common } from './common.mongo.entity'

@Entity()
export class User extends Common {
  @Column('text')
  name: string

  @Column({ length: 200 })
  email: string
}
