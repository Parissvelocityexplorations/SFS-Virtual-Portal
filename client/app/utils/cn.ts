/**
 * Utility function for conditionally joining CSS class names together
 * 
 * @param classes - List of class names, undefined values, or boolean values
 * @returns String of joined class names
 */
export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}