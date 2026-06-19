import React from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/store';
import { login } from '@/store/slices/authSlice';
import { claimDummyTasks } from '@/store/slices/tasksSlice';
import AuthForm from './AuthForm';
import type { AuthFormValues } from './AuthForm';

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: AuthFormValues) => {
    dispatch(
      login({
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 10),
        user: {
          name: data.name || '',
          email: data.email,
        },
      })
    );
    dispatch(claimDummyTasks(data.email));
    navigate('/dashboard');
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={onSubmit}
      submitLabel="Register"
      submittingLabel="Registering..."
    />
  );
};

export default RegisterForm;
