import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import AuthService from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { TLoginCredentials } from './users/user.types';
import { LocalStrategy } from './auth/local.strategy';

@Controller()
export class AppController {

  constructor(private readonly authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req,
    @Body() credentials: TLoginCredentials): Promise<any> {
      
      let user = await this.authService.validateUser(credentials)
      console.log(user._responses.next()._settledValue)
      return
  }

}
