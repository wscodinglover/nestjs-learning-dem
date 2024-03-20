import { Module, forwardRef, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../entities/user.entity';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service';
import { UserModule } from './user.module';
import { LocalStorage, JwtStorage } from '../strategy';

// const jwtModule = JwtModule.register({
//     secret:"xxx"
// })
// 这里不建议将秘钥写死在代码也， 它应该和数据库配置的数据一样，从环境变量中来
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
    PassportModule,
    jwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage],
  exports: [jwtModule],
})
export class AuthModule {}
