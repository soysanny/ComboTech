"use client";

import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import { toast } from "@/lib/toast";
import { authService } from "../services/authService";
import type { LoginInput } from "../types";

/**
 * Login mutation. On success the session is stored in Redux; the httpOnly
 * `svc_session` cookie is issued by the login API route for the proxy guard.
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Signed in successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Sign in failed. Please try again.");
    },
  });
}
