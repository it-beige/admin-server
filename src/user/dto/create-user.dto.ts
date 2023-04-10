import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  /**
   * 手机号（系统唯一）
   */
  @ApiProperty({ example: '18870912192' })
  readonly phoneNumber: string

  @ApiProperty({ example: '北歌' })
  name: string

  @ApiProperty({ example: '123456' })
  password: string

  @ApiProperty({ example: 'it_beige@163.com' })
  email: string
}
