import React from 'react';
import { Link } from 'react-router';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 backdrop-blur-xl transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-800 via-zinc-900 to-black dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Welcome back to Mayfair Worktops</p>
        </div>
        
        <LoginForm />

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
