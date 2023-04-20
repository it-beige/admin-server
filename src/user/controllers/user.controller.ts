import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UpdateUserDto } from '../dtos/update-user.dto'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-reponse.dto'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import {
  encryptFileMD5,
  generatePassWord,
  makeSalt,
} from '../../shared/utils/cryptogram'
import { UploadDto } from '../dtos/upload.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private getPassword(password) {
    const salt = makeSalt() // 制作密码盐
    const hashPassword = generatePassWord(password, salt) // 加密密码
    return { salt, hashPassword }
  }

  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(BaseApiErrorResponse),
    description: '创建成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
    description: '创建失败',
  })
  @Post('')
  create(@Body() user: CreateUserDto) {
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password)
      user.salt = salt
      user.password = hashPassword
    }
    return this.userService.create(user)
  }

  @ApiOperation({
    summary: '查找所有用户',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateUserDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    return this.userService.findAll(query)
  }

  @ApiOperation({
    summary: '查找单个用户',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @ApiOperation({
    summary: '更新用户',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const { salt, hashPassword } = this.getPassword(user.password)
    user.salt = salt
    user.password = hashPassword
    return this.userService.update(+id, user)
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }

  @ApiOperation({
    summary: '文件上传',
  })
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Req() req: any,
    @Body() upload: UploadDto,
    @UploadedFile() file,
  ): Promise<any> {
    console.log(file)
    const hash = encryptFileMD5(file.buffer)
    console.log(hash)
    return Promise.resolve('1')
  }
}
