import { Logger } from '@nestjs/common';
import { IUser, IUserProfile } from '../interfaces/user.interface';

// export type UserDocument = User & Document; // ??

export class UserProfile implements IUserProfile {
  name!: string;
  gender!: string;
  location!: string;
  picture!: string;
}

export class User implements IUser {
  username!: string;
  isModerator!: boolean;
  // profile!: UserProfile;
  avatar!: string;
  _id?: string;

  constructor(
    username: string,
    isModerator: boolean,
    // profile: UserProfile,
    avatar: string,
    _id?: string
  ) {
    this.username = username;
    this.isModerator = isModerator;
    // this.profile = UserProfile;
    this.avatar = avatar || 'https://avatars.dicebear.com/api/adventurer-neutral/default.svg';
    this._id = _id;
  }
}
