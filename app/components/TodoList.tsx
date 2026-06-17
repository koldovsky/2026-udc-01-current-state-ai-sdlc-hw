'use client';

import { useState, useCallback, useMemo } from 'react';
import { Todo, TodoStatus } from '@/types/todo';
import TodoItem from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus | 'all'>('all');

  const handleCreateTodo = useCallback((title: string): void => {
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      status: 'backlog',
      createdAt: new Date(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setNewTaskTitle('');
  }, []);

  const handleUpdateTodo = useCallback(
    (id: string, updates: Partial<Todo>): void => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );
    },
    []
  );

  const handleDeleteTodo = useCallback((id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const filteredTodos = useMemo(() => {
    if (filterStatus === 'all') return todos;
    return todos.filter((todo) => todo.status === filterStatus);
  }, [todos, filterStatus]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleCreateTodo(newTaskTitle);
    },
    [newTaskTitle, handleCreateTodo]
  );

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.status === 'done').length;
    const inProgress = todos.filter((t) => t.status === 'in progress').length;
    const pending = todos.filter((t) => t.status === 'pending').length;
    const backlog = todos.filter((t) => t.status === 'backlog').length;
    return { total, done, inProgress, pending, backlog };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-2 text-gray-600">
            Stay organized and track your tasks efficiently
          </p>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </div>
              <div className="text-sm text-blue-600">In Progress</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {stats.done}
              </div>
              <div className="text-sm text-green-600">Done</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-600">
                {stats.backlog}
              </div>
              <div className="text-sm text-gray-600">Backlog</div>
            </div>
          </div>
        )}

        {/* Create Task Form */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Filter */}
        {todos.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as TodoStatus | 'all')
              }
              className="w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Tasks</option>
              <option value="backlog">Backlog</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-gray-600">
                {todos.length === 0
                  ? 'No tasks yet. Create one to get started!'
                  : 'No tasks match the selected filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
