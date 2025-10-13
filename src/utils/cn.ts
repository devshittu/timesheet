// src/utils/classnames.ts

import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to combine and merge Tailwind CSS classes.
 * It uses 'clsx' to conditionally join class names and 'tailwind-merge'
 * to resolve conflicts, ensuring the final string is clean and correct.
 *
 * @param inputs - An array of class names, conditional objects, or arrays.
 * @returns A single string of merged Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/classnames.ts
