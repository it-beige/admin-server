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

import { UploadDto } from '../dtos/upload.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.findOne(id)
  }

  @ApiOperation({
    summary: '更新用户',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return {
      data: await this.userService.update(id, user),
    }
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
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
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.userService.uploadAvatar(file)
  }
}
