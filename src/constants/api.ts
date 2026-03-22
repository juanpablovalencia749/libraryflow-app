export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  BOOKS: {
    BASE: "/books",
    BY_ID: (id: number | string) => `/books/${id}`,
  },
  LOANS: {
    BASE: "/loans",
    MY_LOANS: "/loans/my-loans",
    RETURN: (id: number | string) => `/loans/return/${id}`,
    RESERVE: "/loans/reserve",
    LOAN: "/loans/loan",
  },
  LOGS: "/logger",
} as const;
