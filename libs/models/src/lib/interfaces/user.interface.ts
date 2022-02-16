export interface IUserProfile {
  name: string;
  gender: string;
  location: string;
  picture: string;
}

export interface IUser {
  username: string;
  isModerator: boolean;
  // profile: IUserProfile;
  avatar: string;
  _id?: string;
}
