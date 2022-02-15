import { IUser, IUserProfile } from '@mlchat-poc/models';

export class User implements IUser {
  username: string;
  isModerator: boolean;
  // profile: IUserProfile;
  // tslint:disable-next-line: variable-name
  _id?: string;

  constructor(
    username: string,
    isModerator: boolean,
    // profile: IUserProfile,
    // tslint:disable-next-line: variable-name
    _id?: string
  ) {
    this.username = username;
    this.isModerator = isModerator;
    // this.profile = profile;
    this._id = _id;
  }
}
