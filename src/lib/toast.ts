import { toast as sonner } from "sonner";

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Project-standard toast helper wrapping `sonner`. */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonner.success(message, normalizeOptions(options)),
  error: (message: string, options?: ToastOptions) =>
    sonner.error(message, normalizeOptions(options)),
  warning: (message: string, options?: ToastOptions) =>
    sonner.warning(message, normalizeOptions(options)),
  info: (message: string, options?: ToastOptions) =>
    sonner.info(message, normalizeOptions(options)),
  loading: (message: string, options?: ToastOptions) =>
    sonner.loading(message, normalizeOptions(options)),
  promise: sonner.promise,
  dismiss: sonner.dismiss,
};

function normalizeOptions(options?: ToastOptions) {
  return {
    description: options?.description,
    duration: options?.duration ?? 4000,
    action: options?.action,
  };
}
