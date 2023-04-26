import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { MenuService } from '../services/menu.service'
import { ArticleService } from '../services/article.service'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-response.dto'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto'

import { AuthGuard } from '@nestjs/passport'

@ApiTags('菜单')
@Controller('menus')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly articleService: ArticleService,
  ) {}

  @ApiOperation({
    summary: '更新菜单',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateMenuDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() menus: UpdateMenuDto) {
    return {
      data: await this.menuService.update(menus),
    }
  }

  @ApiOperation({
    summary: '查找所有菜单',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateMenuDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async find() {
    const { data } = await this.menuService.find()
    return {
      data,
    }
  }
}
