import { Todo } from '@mlchat-poc/models';

export class TodoModel implements Todo {
  title: string;

  constructor(
    title: string
  ) {
    this.title = title;
  }
}
