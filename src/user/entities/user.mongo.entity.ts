import { ObjectIdColumn, Column, ObjectID, Entity } from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID

  @Column('text')
  name: string

  @Column({ length: 200 })
  email: string
}
