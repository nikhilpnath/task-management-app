import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppSelector } from '@/store/store';
import { useTasks, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import type { Task } from '@/api/tasksApi';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: tasks = [], isLoading, error } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filters and Sorting State
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc'>('createdAt-desc');

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

  const handleStatusChange = (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask({ id: task.id, data: { status: newStatus } });
  };

  // 1. Filter and sort tasks (memoized)
  const processedTasks = useMemo(() => {
    let filtered = tasks.filter(
      (t) => t.createdBy.toLowerCase() === user?.email?.toLowerCase()
    );

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
  }, [tasks, user?.email, priorityFilter, sortBy]);

  // Group tasks by status for columns (memoized)
  const todoTasks = useMemo(() => processedTasks.filter((t) => t.status === 'todo'), [processedTasks]);
  const inProgressTasks = useMemo(() => processedTasks.filter((t) => t.status === 'in-progress'), [processedTasks]);
  const doneTasks = useMemo(() => processedTasks.filter((t) => t.status === 'done'), [processedTasks]);

  // Calculate project progress based on all tasks of this user (memoized)
  const { userTasksCount, userCompletedCount } = useMemo(() => {
    const userTasks = tasks.filter((t) => t.createdBy.toLowerCase() === user?.email?.toLowerCase());
    return {
      userTasksCount: userTasks.length,
      userCompletedCount: userTasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks, user?.email]);

  const progressPercent = userTasksCount > 0 ? Math.round((userCompletedCount / userTasksCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-rose-500">
        Error loading tasks: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Task Board
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Track, arrange, and manage your software development tasks.</p>
        </div>
        <Link
          to="/tasks/new"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-center"
        >
          Create Task
        </Link>
      </div>

      {/* Progress Bar Header */}
      {userTasksCount > 0 && (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">My Project Progress</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {progressPercent}% Completed ({userCompletedCount}/{userTasksCount})
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800/80">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Filters and Sorting Control Bar */}
      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Kanban Board Grid */}
      <div className={`grid grid-cols-1 ${statusFilter === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {(statusFilter === 'all' || statusFilter === 'todo') && (
          <TaskList
            title="To Do"
            taskList={todoTasks}
            columnColor="bg-zinc-500"
            onEdit={(id) => navigate(`/tasks/${id}/edit`)}
            onDeleteClick={openDeleteModal}
            onStatusChange={handleStatusChange}
          />
        )}
        {(statusFilter === 'all' || statusFilter === 'in-progress') && (
          <TaskList
            title="In Progress"
            taskList={inProgressTasks}
            columnColor="bg-indigo-500"
            onEdit={(id) => navigate(`/tasks/${id}/edit`)}
            onDeleteClick={openDeleteModal}
            onStatusChange={handleStatusChange}
          />
        )}
        {(statusFilter === 'all' || statusFilter === 'done') && (
          <TaskList
            title="Done"
            taskList={doneTasks}
            columnColor="bg-emerald-500"
            onEdit={(id) => navigate(`/tasks/${id}/edit`)}
            onDeleteClick={openDeleteModal}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <DeleteTaskDialog
        isOpen={taskToDelete !== null}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TasksPage;
