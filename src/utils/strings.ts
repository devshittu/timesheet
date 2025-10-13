// src/utils/strings.ts

/**
 * Generates a URL-friendly slug from a string
 * @param input - The input string to convert to a slug
 * @returns A normalized slug string
 * @example
 * generateSlug("Hello World!") // returns "hello-world"
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim() // Trim leading/trailing whitespace
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  // .slice(0, 50); // Limit length to 50 characters
}

/**
 * Truncates a string to a specified length with an ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Converts a string to title case
 * @param str - The input string to convert
 * @returns String in title case format
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}
