'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'agentrank_auth';
const USERS_KEY = 'agentrank_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800)); // simulate network
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users: Record<string, { name: string; email: string; passwordHash: string }> = usersRaw
        ? JSON.parse(usersRaw)
        : {};

      if (users[email]) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      // Store user (no real hashing for hackathon demo)
      users[email] = { name, email, passwordHash: btoa(password) };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        plan: 'free',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users: Record<string, { name: string; email: string; passwordHash: string }> = usersRaw
        ? JSON.parse(usersRaw)
        : {};

      const found = users[email];
      if (!found || found.passwordHash !== btoa(password)) {
        return { success: false, error: 'Invalid email or password.' };
      }

      const loggedIn: User = {
        id: crypto.randomUUID(),
        name: found.name,
        email: found.email,
        avatar: found.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        plan: 'free',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
      setUser(loggedIn);
      return { success: true };
    } catch {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
