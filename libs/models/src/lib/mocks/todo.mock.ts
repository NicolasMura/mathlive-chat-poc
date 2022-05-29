// import { User } from '../models/user.model';
import { TodoModel } from '@mlchat-poc/frontend-tools';


const getDefaults = (): TodoModel => ({
  title: 'Todo Mock Title'
});

export const getTodoMock = (todo?: Partial<TodoModel>): TodoModel => ({
  ...getDefaults(),
  ...todo
});
