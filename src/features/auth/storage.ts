
import { AuthUser } from "./types";

const KEY = 'auth_user';

export const saveAuthUser = (user: AuthUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
};

export const loadAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAuthUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY);
  }
};
