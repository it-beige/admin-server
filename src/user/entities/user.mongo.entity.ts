import { Column, Entity } from 'typeorm'
import { Common } from './common.mongo.entity'
import { ObjectId } from 'mongoose'

@Entity()
export class User extends Common {
  @Column('text')
  name: string

  @Column({ length: 200 })
  email: string

  @Column()
  role?: ObjectId
}
