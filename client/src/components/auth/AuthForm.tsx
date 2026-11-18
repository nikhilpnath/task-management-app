import React, { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ColdStartAlert from '@/components/common/ColdStartAlert';

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
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
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
  const [showPassword, setShowPassword] = useState(false);
  const schema = mode === 'register' ? registerSchema : loginSchema;
  const fields = FIELDS[mode];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<AuthFormValues>,
  });

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        {fields.map((field) => {
          const error = errors[field.name];
          const isPasswordField = field.name === 'password';
          const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : field.type;

          return (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={field.name}
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                {field.label}
              </label>
              
              <div className="relative rounded-md shadow-xs">
                {/* Field Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                  {field.name === 'name' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {field.name === 'email' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {field.name === 'password' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>

                <input
                  id={field.name}
                  type={inputType}
                  {...register(field.name)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${field.name}-error` : undefined}
                  autoComplete={field.name === 'password' ? (mode === 'login' ? 'current-password' : 'new-password') : field.name}
                  className={`block w-full rounded-md border bg-white dark:bg-slate-900 pl-9 ${
                    isPasswordField ? 'pr-10' : 'pr-3'
                  } py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    error
                      ? 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20'
                  }`}
                  placeholder={field.placeholder}
                />

                {/* Password visibility toggle */}
                {isPasswordField && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {error && (
                <p id={`${field.name}-error`} role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error.message as string}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        <span>{isSubmitting ? submittingLabel : submitLabel}</span>
      </button>

      <ColdStartAlert isLoading={isSubmitting} />
    </form>
  );
};

export default AuthForm;
