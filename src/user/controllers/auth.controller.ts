import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { LoginDto } from '../dtos/login.dto'
import { AuthService } from '../services/auth.service'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-reponse.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserInfoDto } from '../dtos/auth.dto'

@ApiTags('认证鉴权')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '用户登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([LoginDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('login')
  async login(@Body() login: LoginDto) {
    this.authService.login(login)
  }

  @ApiOperation({
    summary: '获取用户信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserInfoDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @ApiBearerAuth()
  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async info(@Req() req: any): Promise<any> {
    const data = await this.authService.info(req.user.id)
    return {
      data,
    }
  }
}
