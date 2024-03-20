import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { WechatLoginDto } from '../dto/auth/wechat-login.dto';
import { Public } from 'src/strategy/public.auth';

@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user);
  }

  @ApiOperation({ summary: '微信登录跳转' })
  @Get('wechatLogin')
  async wechatLogin(@Headers() header, @Res() res) {
    const APPID = process.env.APPID;
    const redirectUri = encodeURIComponent('http://www.inode.club');
    res.redirect(
      `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
    );
  }

  @ApiOperation({ summary: '微信登录' })
  @ApiBody({ type: WechatLoginDto, required: true })
  @Post('wechat')
  async loginWithWechat(@Body('code') code: string) {
    return this.authService.loginWithWechat(code);
  }
}
