import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../components/TodoList';
import { Todo } from '../types/todo';

// Mock the TodoItem component to isolate TodoList tests
jest.mock('../components/TodoItem', () => {
  return function MockTodoItem({
    todo,
    onUpdate,
    onDelete,
  }: {
    todo: Todo;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
    onDelete: (id: string) => void;
  }) {
    return (
      <div data-testid={`todo-item-${todo.id}`}>
        <span>{todo.title}</span>
        <span data-testid={`todo-status-${todo.id}`}>{todo.status}</span>
        <button
          onClick={() => onUpdate(todo.id, { status: 'done' })}
          data-testid={`update-btn-${todo.id}`}
        >
          Mark Done
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          data-testid={`delete-btn-${todo.id}`}
        >
          Delete
        </button>
      </div>
    );
  };
});

// Mock crypto.randomUUID for consistent testing
const mockUUID = 'test-uuid-1234-5678-90ab-cdef12345678';
global.crypto = {
  randomUUID: jest.fn(() => mockUUID),
} as any;

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Initial State', () => {
    it('should render the component with header text', () => {
      render(<TodoList />);
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(
        screen.getByText('Stay organized and track your tasks efficiently')
      ).toBeInTheDocument();
    });

    it('should render the input form with placeholder', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Add a new task...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should render the Add Task button', () => {
      render(<TodoList />);
      const button = screen.getByRole('button', { name: 'Add Task' });
      expect(button).toBeInTheDocument();
    });

    it('should display empty state message when no tasks exist', () => {
      render(<TodoList />);
      expect(
        screen.getByText('No tasks yet. Create one to get started!')
      ).toBeInTheDocument();
    });

    it('should not display stats when there are no tasks', () => {
      render(<TodoList />);
      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });

    it('should not display filter when there are no tasks', () => {
      render(<TodoList />);
      expect(screen.queryByLabelText('Filter by status:')).not.toBeInTheDocument();
    });
  });

  describe('Task Creation', () => {
    it('should add a new task when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Buy groceries');
      await user.click(button);

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should clear input field after successful task creation', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText(
        'Add a new task...'
      ) as HTMLInputElement;
      await user.type(input, 'New task');
      await user.click(screen.getByRole('button', { name: 'Add Task' }));

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should not add task with empty string', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const button = screen.getByRole('button', { name: 'Add Task' });
      await user.click(button);

      expect(
        screen.getByText('No tasks yet. Create one to get started!')
      ).toBeInTheDocument();
    });

    it('should not add task with whitespace only', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, '   ');
      await user.click(button);

      expect(
        screen.getByText('No tasks yet. Create one to get started!')
      ).toBeInTheDocument();
    });

    it('should trim whitespace from task title', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, '  Task with spaces  ');
      await user.click(button);

      expect(screen.getByText('Task with spaces')).toBeInTheDocument();
    });

    it('should add new task with backlog status', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'New task');
      await user.click(button);

      const statusElement = screen.getByTestId('todo-status-' + mockUUID);
      expect(statusElement).toHaveTextContent('backlog');
    });

    it('should add multiple tasks in correct order (newest first)', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      // First, we need to mock different UUIDs for multiple tasks
      const uuids = ['uuid-1', 'uuid-2', 'uuid-3'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'First task');
      await user.click(button);

      await user.type(input, 'Second task');
      await user.click(button);

      await user.type(input, 'Third task');
      await user.click(button);

      const items = screen.getAllByTestId(/^todo-item-/);
      expect(items).toHaveLength(3);
      // Newest should be first
      expect(items[0]).toHaveTextContent('Third task');
      expect(items[1]).toHaveTextContent('Second task');
      expect(items[2]).toHaveTextContent('First task');
    });

    it('should submit task by pressing Enter key', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');

      await user.type(input, 'Task from Enter key');
      await user.keyboard('{Enter}');

      expect(screen.getByText('Task from Enter key')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });
  });

  describe('Stats Display', () => {
    it('should display stats when tasks exist', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task 1');
      await user.click(button);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('Backlog')).toBeInTheDocument();
    });

    it('should calculate correct total count', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2', 'uuid-3'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      await user.type(input, 'Task 3');
      await user.click(button);

      const totalStats = screen.getAllByText('Total');
      const totalCount = totalStats[0].parentElement?.querySelector(
        '.text-2xl'
      );
      expect(totalCount).toHaveTextContent('3');
    });

    it('should count backlog status correctly', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      const backlogStats = screen.getAllByText('Backlog');
      const backlogCount = backlogStats[0].parentElement?.querySelector(
        '.text-2xl'
      );
      expect(backlogCount).toHaveTextContent('2');
    });

    it('should update stats when task status changes', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task 1');
      await user.click(button);

      // Mark task as done
      const markDoneBtn = screen.getByTestId('update-btn-' + mockUUID);
      await user.click(markDoneBtn);

      const doneStats = screen.getAllByText('Done');
      const doneCount = doneStats[0].parentElement?.querySelector('.text-2xl');
      expect(doneCount).toHaveTextContent('1');
    });

    it('should update stats when task is deleted', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      const deleteBtn = screen.getByTestId('delete-btn-uuid-1');
      await user.click(deleteBtn);

      const totalStats = screen.getAllByText('Total');
      const totalCount = totalStats[0].parentElement?.querySelector(
        '.text-2xl'
      );
      expect(totalCount).toHaveTextContent('1');
    });
  });

  describe('Filtering', () => {
    it('should display filter dropdown when tasks exist', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task 1');
      await user.click(button);

      const filterLabel = screen.getByLabelText('Filter by status:');
      expect(filterLabel).toBeInTheDocument();
    });

    it('should have all filter options available', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task 1');
      await user.click(button);

      const select = screen.getByDisplayValue('All Tasks');
      expect(within(select as HTMLElement).getByText('All Tasks')).toBeInTheDocument();
      expect(within(select as HTMLElement).getByText('Backlog')).toBeInTheDocument();
      expect(within(select as HTMLElement).getByText('In Progress')).toBeInTheDocument();
      expect(within(select as HTMLElement).getByText('Pending')).toBeInTheDocument();
      expect(within(select as HTMLElement).getByText('Done')).toBeInTheDocument();
    });

    it('should show all tasks when filter is set to "all"', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2', 'uuid-3'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      await user.type(input, 'Task 3');
      await user.click(button);

      const select = screen.getByDisplayValue('All Tasks');
      await user.selectOptions(select, 'all');

      const items = screen.getAllByTestId(/^todo-item-/);
      expect(items).toHaveLength(3);
    });

    it('should filter tasks by backlog status', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Backlog task');
      await user.click(button);

      const select = screen.getByDisplayValue('All Tasks');
      await user.selectOptions(select, 'backlog');

      const items = screen.queryAllByTestId(/^todo-item-/);
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item).toHaveTextContent('Backlog task');
      });
    });

    it('should display no matching message when filter has no results', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Backlog task');
      await user.click(button);

      const select = screen.getByDisplayValue('All Tasks');
      await user.selectOptions(select, 'done');

      expect(
        screen.getByText('No tasks match the selected filter.')
      ).toBeInTheDocument();
    });

    it('should switch between filter options', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task 1');
      await user.click(button);

      const select = screen.getByDisplayValue('All Tasks');

      // Filter to backlog
      await user.selectOptions(select, 'backlog');
      let items = screen.queryAllByTestId(/^todo-item-/);
      expect(items.length).toBeGreaterThan(0);

      // Filter to done
      await user.selectOptions(select, 'done');
      expect(
        screen.getByText('No tasks match the selected filter.')
      ).toBeInTheDocument();

      // Back to all
      await user.selectOptions(select, 'all');
      items = screen.queryAllByTestId(/^todo-item-/);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('Task Updates and Deletion', () => {
    it('should pass correct props to TodoItem component', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Test task');
      await user.click(button);

      const todoItem = screen.getByTestId('todo-item-' + mockUUID);
      expect(todoItem).toBeInTheDocument();
      expect(todoItem).toHaveTextContent('Test task');
      expect(todoItem).toHaveTextContent('backlog');
    });

    it('should handle task update callback', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task to update');
      await user.click(button);

      const updateBtn = screen.getByTestId('update-btn-' + mockUUID);
      await user.click(updateBtn);

      const statusElement = screen.getByTestId('todo-status-' + mockUUID);
      expect(statusElement).toHaveTextContent('done');
    });

    it('should handle task deletion callback', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Task to delete');
      await user.click(button);

      const deleteBtn = screen.getByTestId('delete-btn-' + mockUUID);
      await user.click(deleteBtn);

      expect(screen.queryByTestId('todo-item-' + mockUUID)).not.toBeInTheDocument();
      expect(
        screen.getByText('No tasks yet. Create one to get started!')
      ).toBeInTheDocument();
    });

    it('should render TodoItem for each task', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2', 'uuid-3'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      await user.type(input, 'Task 3');
      await user.click(button);

      expect(screen.getByTestId('todo-item-uuid-1')).toBeInTheDocument();
      expect(screen.getByTestId('todo-item-uuid-2')).toBeInTheDocument();
      expect(screen.getByTestId('todo-item-uuid-3')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: create, filter, update, delete', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      // Create tasks
      await user.type(input, 'Task 1');
      await user.click(button);

      await user.type(input, 'Task 2');
      await user.click(button);

      // Verify both tasks exist
      let items = screen.queryAllByTestId(/^todo-item-/);
      expect(items).toHaveLength(2);

      // Update a task
      const markDoneBtn = screen.getByTestId('update-btn-uuid-2');
      await user.click(markDoneBtn);

      // Verify stats updated
      const doneStats = screen.getAllByText('Done');
      const doneCount = doneStats[0].parentElement?.querySelector('.text-2xl');
      expect(doneCount).toHaveTextContent('1');

      // Filter to done
      const select = screen.getByDisplayValue('All Tasks');
      await user.selectOptions(select, 'done');

      items = screen.queryAllByTestId(/^todo-item-/);
      expect(items).toHaveLength(1);

      // Delete the task
      const deleteBtn = screen.getByTestId('delete-btn-uuid-2');
      await user.click(deleteBtn);

      // Verify empty state
      expect(
        screen.getByText('No tasks yet. Create one to get started!')
      ).toBeInTheDocument();
    });

    it('should maintain stats accuracy through multiple operations', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add Task' });

      const uuids = ['uuid-1', 'uuid-2', 'uuid-3', 'uuid-4'];
      let uuidIndex = 0;
      (global.crypto.randomUUID as jest.Mock).mockImplementation(
        () => uuids[uuidIndex++]
      );

      // Create 4 tasks
      for (let i = 1; i <= 4; i++) {
        await user.type(input, `Task ${i}`);
        await user.click(button);
      }

      // Verify total is 4
      let totalStats = screen.getAllByText('Total');
      let totalCount = totalStats[0].parentElement?.querySelector('.text-2xl');
      expect(totalCount).toHaveTextContent('4');

      // Mark 2 as done
      await user.click(screen.getByTestId('update-btn-uuid-3'));
      await user.click(screen.getByTestId('update-btn-uuid-4'));

      // Verify stats
      const doneStats = screen.getAllByText('Done');
      const doneCount = doneStats[0].parentElement?.querySelector('.text-2xl');
      expect(doneCount).toHaveTextContent('2');

      const backlogStats = screen.getAllByText('Backlog');
      const backlogCount = backlogStats[0].parentElement?.querySelector(
        '.text-2xl'
      );
      expect(backlogCount).toHaveTextContent('2');

      // Delete one task
      await user.click(screen.getByTestId('delete-btn-uuid-1'));

      // Verify total is 3
      totalStats = screen.getAllByText('Total');
      totalCount = totalStats[0].parentElement?.querySelector('.text-2xl');
      expect(totalCount).toHaveTextContent('3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<TodoList />);

      const form = screen.getByPlaceholderText('Add a new task...').closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should have descriptive button text', () => {
      render(<TodoList />);

      const button = screen.getByRole('button', { name: 'Add Task' });
      expect(button).toBeInTheDocument();
    });

    it('should have labeled filter dropdown', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, 'Task');
      await user.click(screen.getByRole('button', { name: 'Add Task' }));

      const label = screen.getByText('Filter by status:');
      const select = screen.getByDisplayValue('All Tasks');

      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    });
  });
});
