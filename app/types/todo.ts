// Type definitions for Todo feature

export type TodoStatus = 'backlog' | 'in progress' | 'pending' | 'done';

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: Date;
}
