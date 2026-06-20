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
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          {errorMsg}
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
