import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  createdBy: string;
  createdAt: string;
}

interface TasksState {
  items: Task[];
}

const getInitialUserEmail = (): string => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      return parsed.email || 'test@g.com';
    }
  } catch {
    // ignore
  }
  return 'test@g.com';
};

const defaultEmail = getInitialUserEmail();

const initialState: TasksState = {
  items: [
    {
      id: '1',
      title: 'Initialize repository and configurations',
      description: 'Set up Vite client, Express backend, and TypeScript settings.',
      status: 'done',
      priority: 'high',
      dueDate: '2026-06-25',
      createdBy: defaultEmail,
      createdAt: '2026-06-18T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Design user authentication system',
      description: 'Set up routes, backend middleware, and pages for registration/login.',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-06-30',
      createdBy: defaultEmail,
      createdAt: '2026-06-18T11:00:00.000Z',
    },
    {
      id: '3',
      title: 'Implement drag and drop task board',
      description: 'Use a clean library or vanilla HTML5 drag and drop to arrange tasks.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-07-05',
      createdBy: defaultEmail,
      createdAt: '2026-06-18T12:00:00.000Z',
    },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    claimDummyTasks: (state, action: PayloadAction<string>) => {
      const newEmail = action.payload;
      state.items.forEach(task => {
        if (task.id === '1' || task.id === '2' || task.id === '3') {
          task.createdBy = newEmail;
        }
      });
    },
  },
});

export const { addTask, updateTask, deleteTask, claimDummyTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
