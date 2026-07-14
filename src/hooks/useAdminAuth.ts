// src/hooks/useAdminAuth.ts
import { useState, useCallback } from 'react';

const SESSION_KEY = 'rd_admin_auth';
const CORRECT_PIN = import.meta.env.VITE_ADMIN_PIN as string;

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [error, setError] = useState<string>('');

  const login = useCallback((pin: string): boolean => {
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      return true;
    } else {
      setError('PIN incorrecto. Intentá de nuevo.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout, error };
}
