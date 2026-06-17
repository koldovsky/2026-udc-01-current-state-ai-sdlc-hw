'use client';

import { useCallback } from 'react';
import { Todo, TodoStatus } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: TodoStatus[] = ['backlog', 'in progress', 'pending', 'done'];

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate(todo.id, { status: e.target.value as TodoStatus });
    },
    [todo.id, onUpdate]
  );

  const handleTitleEdit = useCallback(() => {
    const newTitle = prompt('Edit task title:', todo.title);
    if (newTitle && newTitle.trim()) {
      onUpdate(todo.id, { title: newTitle.trim() });
    }
  }, [todo.id, todo.title, onUpdate]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
    }
  }, [todo.id, onDelete]);

  const getStatusColor = (status: TodoStatus): string => {
    const colors: Record<TodoStatus, string> = {
      backlog: 'bg-gray-100 text-gray-800',
      'in progress': 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800',
    };
    return colors[status];
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{todo.title}</h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </p>
        </div>

        <select
          value={todo.status}
          onChange={handleStatusChange}
          className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium transition-colors ${getStatusColor(
            todo.status
          )}`}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="ml-4 flex gap-2">
        <button
          onClick={handleTitleEdit}
          className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
