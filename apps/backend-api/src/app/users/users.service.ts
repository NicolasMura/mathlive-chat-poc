import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@mlchat-poc/models';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private currentUser: User;

  async login(user: User): Promise<User> {
    console.log(this.users);
    const existingUser: User = this.users.find((u: User) => u.username === user.username);
    console.log('existingUser:');
    console.log(existingUser);

    if (existingUser) {
      Logger.error(`Username ${user.username} already taken`);
      // throw new ForbiddenException(`Username ${user.username} already taken`);
    }

    this.users.push(user);
    this.setCurrentUser(user);
    return this.currentUser;
  }

  async getCurrentUser(): Promise<User> {
    return this.currentUser;
  }

  async setCurrentUser(user: User): Promise<User> {
    this.currentUser = user;
    return this.currentUser;
  }

  async findUserById(id: string): Promise<User | undefined> {
    const user: User = this.users.find(user => user._id === id);

    if (!user) {
      Logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async createUser(user: User): Promise<Partial<User> | undefined> {
    const existingUsername = this.users.find(u => u.username === user.username);

    if (existingUsername) {
      Logger.error(`This username is already taken`);
      throw new ConflictException(`This username already taken`);
    }

    Logger.log('newUser');
    Logger.log(user);
    this.users.push(user);

    return user;
  }
}
