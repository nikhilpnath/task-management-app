import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/store';
import { login } from '@/store/slices/authSlice';
import { apiFetch } from '@/api/client';
import AuthForm from './AuthForm';
import type { AuthFormValues } from './AuthForm';

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: AuthFormValues) => {
    setErrorMsg(null);
    try {
      const res = await apiFetch<{ user: { name: string; email: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      dispatch(
        login({
          user: res.user,
        })
      );
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'An error occurred during registration.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}
      <AuthForm
        mode="register"
        onSubmit={onSubmit}
        submitLabel="Create Account"
        submittingLabel="Creating account..."
      />
    </div>
  );
};

export default RegisterForm;
