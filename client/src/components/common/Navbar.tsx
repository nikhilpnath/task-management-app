import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { apiFetch } from '@/api/client';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'New Task', path: '/tasks/new' },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Header Bar Container (holds background and backdrop filter) */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/50 backdrop-blur-xl text-zinc-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between relative">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-indigo-200 bg-clip-text text-transparent">
                Mayfair Worktops
              </Link>
            </div>

            {/* Desktop Nav Items (Centered) */}
            <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Header Options (Desktop/Tablet) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">{user.email}</span>
                </div>
              )}
              
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {user && (
                <button
                   onClick={handleSignOut}
                   className="hidden sm:inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-red-600 dark:hover:text-red-400 transition-colors text-zinc-700 dark:text-white"
                >
                  Sign Out
                </button>
              )}

              {/* Hamburger Button (Mobile Only) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Open Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay (Renders outside the stacking context of backdrop-blur) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col justify-between p-6 md:hidden transition-colors duration-200">
          {/* Top Section */}
          <div className="space-y-8">
            {/* Header inside overlay */}
            <div className="flex items-center justify-between">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-indigo-200 bg-clip-text text-transparent"
              >
                Mayfair Worktops
              </Link>
              <div className="flex items-center gap-2">
                {/* Theme Toggle Button inside overlay */}
                <ThemeToggle />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close Menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Section (Docked to bottom) */}
          {user && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
              <div className="px-4 flex flex-col">
                <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">{user.name}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3.5 text-base font-bold text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 transition-colors text-zinc-700 dark:text-white shadow-sm"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
