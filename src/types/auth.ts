export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
}

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionStatus: SessionStatus;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginResponse {
  user?: User;
  token?: string;
  access_token?: string;
}
