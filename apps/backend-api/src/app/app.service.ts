import { Injectable } from '@nestjs/common';
import { Todo } from '@mlchat-poc/models';


@Injectable()
export class AppService {
  todos: Todo[] = [{ title: 'Todo 1' }, { title: 'Todo 2' }];

  // getData(): { message: string } {
  //   return { message: 'Welcome to api!' };
  // }

  getData(): Todo[] {
    return this.todos;
  }

  addTodo() {
    this.todos.push({
      title: `New todo ${Math.floor(Math.random() * 1000)}`,
    });
    return this.todos;
  }
}
