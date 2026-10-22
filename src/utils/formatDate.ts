import { format, formatDistanceToNow, parseISO } from "date-fns";

function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  return parseISO(value);
}

/** Format a date value using a date-fns pattern (default: "MMM d, yyyy"). */
export function formatDate(
  value: Date | string | number,
  pattern = "MMM d, yyyy",
): string {
  return format(toDate(value), pattern);
}

/** Format a date value with time (default: "MMM d, yyyy 'at' h:mm a"). */
export function formatDateTime(value: Date | string | number): string {
  return format(toDate(value), "MMM d, yyyy 'at' h:mm a");
}

/** Human-friendly relative time, e.g. "3 hours ago". */
export function formatRelativeTime(value: Date | string | number): string {
  return formatDistanceToNow(toDate(value), { addSuffix: true });
}
