import { useEffect, useState } from 'react';

export function useNow(interval = 15000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(timer);
  }, [interval]);
  return now;
}

export const pad2 = (value) => String(value).padStart(2, '0');

export const clockTime = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

export const longDate = (date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export function shortStamp(ts) {
  const date = new Date(ts);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return clockTime(date);
  const yesterday = new Date(today.getTime() - 86400000);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function fullStamp(ts) {
  return `${shortStamp(ts)} · ${clockTime(new Date(ts))}`;
}

export const mmss = (seconds) => `${pad2(Math.floor(seconds / 60) % 60)}:${pad2(Math.floor(seconds % 60))}`;

export const hhmmss = (seconds) =>
  `${pad2(Math.floor(seconds / 3600))}:${pad2(Math.floor((seconds % 3600) / 60))}:${pad2(Math.floor(seconds % 60))}`;

export const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
