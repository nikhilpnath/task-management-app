import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  defaultValues?: Partial<TaskFormValues>;
  isSubmitting: boolean;
  buttonLabel: string;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting,
  buttonLabel,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      status: 'todo',
      dueDate: (() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      })(),
      ...defaultValues,
    },
  });

  const selectedPriority = useWatch({ control, name: 'priority' });
  const selectedStatus = useWatch({ control, name: 'status' });

  // Keep form fields synced when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const setDatePreset = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setValue('dueDate', dateStr, { shouldValidate: true });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Title Field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Task Title <span className="text-rose-500">*</span>
          </label>
        </div>
        <input
          id="title"
          type="text"
          {...register('title')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={`block w-full rounded-md border bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
            errors.title
              ? 'border-rose-500 focus-visible:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20'
          }`}
          placeholder="e.g. Implement user login API authentication"
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errors.title.message}</span>
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="block w-full rounded-md border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          placeholder="Add details, acceptance criteria, or relevant technical context..."
        />
      </div>

      {/* Priority & Status Segmented Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Priority Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Priority
          </span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Priority">
            {(['low', 'medium', 'high'] as const).map((p) => {
              const isSelected = selectedPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setValue('priority', p, { shouldValidate: true })}
                  className={`py-2 px-3 rounded-md text-xs font-semibold capitalize border transition-all text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? p === 'high'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/30'
                        : p === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 ring-1 ring-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 ring-1 ring-slate-400/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      p === 'high' ? 'bg-rose-500' : p === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                  />
                  <span>{p}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Status
          </span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Status">
            {(
              [
                { id: 'todo', label: 'To Do', color: 'bg-slate-400' },
                { id: 'in-progress', label: 'In Progress', color: 'bg-indigo-500' },
                { id: 'done', label: 'Done', color: 'bg-emerald-500' },
              ] as const
            ).map((s) => {
              const isSelected = selectedStatus === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setValue('status', s.id, { shouldValidate: true })}
                  className={`py-2 px-2.5 rounded-md text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? s.id === 'done'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/30'
                        : s.id === 'in-progress'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 ring-1 ring-slate-400/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Due Date with Quick Presets */}
      <div className="space-y-2">
        <label htmlFor="dueDate" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Due Date
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="block rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white transition-colors focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDatePreset(0)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDatePreset(1)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDatePreset(7)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              Next Week
            </button>
            <button
              type="button"
              onClick={() => setValue('dueDate', '', { shouldValidate: true })}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              No date
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-sm font-semibold text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          <span>{isSubmitting ? 'Saving...' : buttonLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
