import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email({ error: 'Invalid email address' })),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').pipe(z.email({ error: 'Invalid email address' })),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AuthFormValues = z.infer<typeof registerSchema>;

interface FieldConfig {
  name: 'name' | 'email' | 'password';
  label: string;
  type: string;
  placeholder: string;
}

const FIELDS: Record<'login' | 'register', FieldConfig[]> = {
  login: [
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ],
  register: [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ],
};

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormValues) => void;
  submitLabel: string;
  submittingLabel: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  submitLabel,
  submittingLabel,
}) => {
  const schema = mode === 'register' ? registerSchema : loginSchema;
  const fields = FIELDS[mode];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema) as any,
  });

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {fields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-350">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                {...register(field.name)}
                className={`mt-1 block w-full rounded-lg border bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 sm:text-sm ${
                  error
                    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-zinc-300 dark:border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder={field.placeholder}
              />
              {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {error.message as string}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
