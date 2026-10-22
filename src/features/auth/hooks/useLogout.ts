"use client";

import { useAppDispatch } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { toast } from "@/lib/toast";
import { authService } from "../services/authService";

/** Clears server session cookies and local Redux auth state. */
export function useLogout() {
  const dispatch = useAppDispatch();

  const logout = () => {
    // Clear local state first so the UI reacts immediately.
    dispatch(logoutAction());
    // The httpOnly cookies can only be cleared server-side.
    void authService.logout().catch(() => {
      // Best-effort; local state is already cleared.
    });
    toast.success("Signed out successfully");
  };

  return logout;
}
