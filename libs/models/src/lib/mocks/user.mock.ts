// import { User } from '../models/user.model';
import { User } from '@mlchat-poc/frontend-tools';


const getDefaults = (): User => ({
  username: 'bob',
  isModerator: false,
  // profile: {
  //   name: 'Bob',
  //   gender: 'M',
  //   location: 'Paris',
  //   picture: ''
  // },
  _id: '61b7c23244fe418be6001a6b'
});

export const getUserMock = (brand?: Partial<User>): User => ({
  ...getDefaults(),
  ...brand
});
