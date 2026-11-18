import React, { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useAppSelector } from '@/store/store';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import type { Task } from '@/api/tasksApi';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import TaskDrawer from '@/components/tasks/TaskDrawer';
import type { TaskFormValues } from '@/components/tasks/TaskForm';

const TasksPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: tasks = [], isLoading, error } = useTasks();
  const { mutate: createTaskMutation, isPending: isCreatingTask } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    task?: Task | null;
  }>({ isOpen: false, task: null });

  // Filters, Search and Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc'>('createdAt-desc');

  // DnD-Kit Sensors (supports mouse, trackpad, touchscreen, and keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold prevents accidental drag on simple clicks
      },
    }),
    useSensor(KeyboardSensor)
  );

  const openDeleteModal = (id: string) => {
    setTaskToDelete(id);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleOpenEdit = (id: string) => {
    const t = tasks.find((item) => item.id === id);
    if (t) {
      setDrawerState({ isOpen: true, task: t });
    }
  };

  const handleStatusChange = (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask({ id: task.id, data: { status: newStatus } });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const targetStatus = over.id as 'todo' | 'in-progress' | 'done';

    if (['todo', 'in-progress', 'done'].includes(targetStatus)) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== targetStatus) {
        updateTask({ id: taskId, data: { status: targetStatus } });
      }
    }
  };

  const handleQuickCreateTask = (title: string, columnStatus: 'todo' | 'in-progress' | 'done') => {
    if (!title.trim()) return;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    createTaskMutation({
      title: title.trim(),
      status: columnStatus,
      priority: 'medium',
      dueDate: todayStr,
    });
  };

  const handleDrawerSubmit = (values: TaskFormValues) => {
    if (drawerState.task) {
      // Edit mode
      updateTask(
        {
          id: drawerState.task.id,
          data: {
            title: values.title,
            description: values.description,
            priority: values.priority,
            status: values.status,
            dueDate: values.dueDate || '',
          },
        },
        {
          onSuccess: () => {
            setDrawerState({ isOpen: false, task: null });
          },
        }
      );
    } else {
      // Create mode
      createTaskMutation(
        {
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
          dueDate: values.dueDate || '',
        },
        {
          onSuccess: () => {
            setDrawerState({ isOpen: false, task: null });
          },
        }
      );
    }
  };

  // Filter and sort tasks (memoized)
  const processedTasks = useMemo(() => {
    let filtered = tasks.filter(
      (t) => t.createdBy.toLowerCase() === user?.email?.toLowerCase()
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'dueDate-desc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === 'createdAt-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Default: 'createdAt-desc'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, user?.email, priorityFilter, sortBy, searchQuery]);

  // Group tasks by status for columns
  const todoTasks = useMemo(() => processedTasks.filter((t) => t.status === 'todo'), [processedTasks]);
  const inProgressTasks = useMemo(() => processedTasks.filter((t) => t.status === 'in-progress'), [processedTasks]);
  const doneTasks = useMemo(() => processedTasks.filter((t) => t.status === 'done'), [processedTasks]);

  // Total project completion progress
  const { userTasksCount, userCompletedCount } = useMemo(() => {
    const userTasks = tasks.filter((t) => t.createdBy.toLowerCase() === user?.email?.toLowerCase());
    return {
      userTasksCount: userTasks.length,
      userCompletedCount: userTasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks, user?.email]);

  const progressPercent = userTasksCount > 0 ? Math.round((userCompletedCount / userTasksCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Task Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, prioritize, and drag tasks across your development workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerState({ isOpen: true, task: null })}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-sm font-semibold text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>

      {error ? (
        <div className="p-8 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center text-rose-600 dark:text-rose-400 text-sm">
          Error loading tasks: {error.message}
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {['To Do', 'In Progress', 'Done'].map((col) => (
            <div key={col} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 min-h-[380px]">
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-lg bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Progress Velocity Banner */}
          {userTasksCount > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors duration-150">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Project Progress
                </span>
                <span className="text-xs font-bold font-tabular text-indigo-600 dark:text-indigo-400">
                  {progressPercent}% Completed ({userCompletedCount}/{userTasksCount})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Filters and Search Bar */}
          <TaskFilters
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Kanban Board Columns Grid wrapped in DndContext */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TaskList
                title="To Do"
                status="todo"
                taskList={todoTasks}
                columnColor="bg-slate-400 dark:bg-slate-500"
                onEdit={handleOpenEdit}
                onDeleteClick={openDeleteModal}
                onStatusChange={handleStatusChange}
                onCreateQuickTask={handleQuickCreateTask}
                isCreating={isCreatingTask}
              />
              <TaskList
                title="In Progress"
                status="in-progress"
                taskList={inProgressTasks}
                columnColor="bg-indigo-500"
                onEdit={handleOpenEdit}
                onDeleteClick={openDeleteModal}
                onStatusChange={handleStatusChange}
                onCreateQuickTask={handleQuickCreateTask}
                isCreating={isCreatingTask}
              />
              <TaskList
                title="Done"
                status="done"
                taskList={doneTasks}
                columnColor="bg-emerald-500"
                onEdit={handleOpenEdit}
                onDeleteClick={openDeleteModal}
                onStatusChange={handleStatusChange}
                onCreateQuickTask={handleQuickCreateTask}
                isCreating={isCreatingTask}
              />
            </div>
          </DndContext>
        </>
      )}

      {/* Accessible Confirmation Modal */}
      <DeleteTaskDialog
        isOpen={taskToDelete !== null}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {/* Slide-Over Drawer for In-Context Task Creation & Editing */}
      <TaskDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ isOpen: false, task: null })}
        task={drawerState.task}
        onSubmit={handleDrawerSubmit}
        isSubmitting={isCreatingTask || isUpdatingTask}
      />
    </div>
  );
};

export default TasksPage;
