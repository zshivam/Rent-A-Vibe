import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for conditional Tailwind class merging.
 * Combines clsx (conditional logic) with tailwind-merge (deduplication).
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-brand-500', 'px-6') // → 'py-2 bg-brand-500 px-6'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sleeps for the given number of milliseconds.
 * Useful in retry loops.
 */
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Truncates a string to `maxLen` characters, appending '…' if truncated.
 */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}…` : str;
}

/**
 * Generates an array of all dates (YYYY-MM-DD) between start and end inclusive.
 * Used to mark calendar dates as unavailable.
 */
export function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Returns a friendly relative date label.
 * e.g. "Today", "Tomorrow", "Mon, 12 Jan"
 */
export function friendlyDate(dateStr: string): string {
  const date  = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
