import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@mlchat-poc/models';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private currentUser: User;

  async login(user: User): Promise<User> {
    console.log('Users in cache : ', this.users);
    const existingUser: User = await this.findUserByUsername(user.username);
    console.log('existingUser:');
    console.log(existingUser);

    if (existingUser) {
      Logger.error(`Username ${user.username} already taken`);
      // throw new ForbiddenException(`Username ${user.username} already taken`);
      throw new ConflictException(`Username ${user.username} already taken`);
    }

    // this.users.push(user);
    this.setCurrentUser(user);
    return this.currentUser;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): User {
    this.currentUser = user;
    return this.currentUser;
  }

  findUserByUsername(username: string): User {
    const user: User = this.users.find(user => user.username === username);

    return user;
  }

  findUserById(id: string): User {
    const user: User = this.users.find(user => user._id === id);

    if (!user) {
      Logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  findAll(): User[] {
    console.log('Users in cache : ', this.users);
    return this.users;
  }

  createUser(user: User): Partial<User> {
    const existingUsername = this.users.find(u => u.username === user.username);

    if (existingUsername) {
      Logger.error(`This username is already taken`);
      throw new ConflictException(`This username already taken`);
      // Logger.error(`Username ${user.username} already taken`);
      // throw new ForbiddenException(`Username ${user.username} already taken`);
    }

    Logger.log('newUser');
    Logger.log(user);
    this.users.push(user);

    return user;
  }

  deleteUser(username: string): string {
    const existingUsername = this.users.find((user: User) => user.username === username);

    if (!existingUsername) {
      Logger.error(`User with id ${username} not found`);
      throw new NotFoundException(`User with id ${username} not found`);
    }

    this.users = this.users.filter((user: User) => user.username !== username);

    return username;
  }
}
