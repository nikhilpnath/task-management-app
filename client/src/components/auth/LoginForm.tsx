import React from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/store';
import { login } from '@/store/slices/authSlice';
import { claimDummyTasks } from '@/store/slices/tasksSlice';
import AuthForm from './AuthForm';
import type { AuthFormValues } from './AuthForm';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: AuthFormValues) => {
    dispatch(
      login({
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 10),
        user: {
          name: data.email.split('@')[0],
          email: data.email,
        },
      })
    );
    dispatch(claimDummyTasks(data.email));
    navigate('/dashboard');
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={onSubmit}
      submitLabel="Sign In"
      submittingLabel="Signing in..."
    />
  );
};

export default LoginForm;
