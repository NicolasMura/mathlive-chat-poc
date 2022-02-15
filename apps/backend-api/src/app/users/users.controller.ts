import { User } from '@mlchat-poc/models';
import { Body, Controller, Get, Logger, Param, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Post('login')
  async login(@Body() user: User) {
    Logger.log('******* login *******');
    Logger.log(user);
    // return req.user;
    return this.usersService.login(user);
  }

  @Get('current')
  getProfile(@Request() req) {
    Logger.log('******* get current user *******');
    Logger.log(req.user);
    // return req.user;
    return this.usersService.getCurrentUser();
  }

  @Get('')
  async getAllUsers() {
    Logger.log('******* get all users *******');
    // return req.user;
    return this.usersService.findAll();
  }
}
