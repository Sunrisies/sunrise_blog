import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/guard/jwt.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        console.log('Received config:jwt', configService.get('JWT_SECRET'), configService.get('jwt').secret);
        return {
          secret: configService.get('jwt').secret,
          signOptions: { expiresIn: configService.get('jwt').expiresIn }
        }
      },
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtModule]
})
export class AuthModule { }
