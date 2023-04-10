import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'

export class CreateUserDto {
  /**
   * 手机号（系统唯一）
   */
  @ApiProperty({ example: '18870912192' })
  @Matches(/^1\d{10}$/g, { message: 'phoneNumber error' })
  readonly phoneNumber: string

  @ApiProperty({ example: '北歌' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: '123456' })
  @Length(6, 9)
  password: string

  @IsNotEmpty()
  @ApiProperty({ example: 'it_beige@163.com' })
  @IsEmail({}, { message: '请输入正确的电子邮件地址' })
  email: string
}
