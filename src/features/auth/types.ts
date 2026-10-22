import type { AuthUser } from "@/redux/slices/authSlice";

export type { AuthUser };

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
