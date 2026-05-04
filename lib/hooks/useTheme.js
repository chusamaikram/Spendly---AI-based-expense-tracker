'use client';
 
import { useState, useEffect } from 'react';
 
export function useTheme() {
  const [theme, setTheme] = useState('dark');
 
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'dark';
    setTheme(stored);
    document.documentElement.classList.toggle('light', stored === 'light');
    document.documentElement.classList.toggle('dark', stored === 'dark');
  }, []);
 
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
    document.documentElement.classList.toggle('dark', next === 'dark');
  };
 
  return { theme, toggleTheme };
}