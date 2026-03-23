import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User, AuthState } from "@/types";
import { axiosClient } from "@/api/axiosClient";
import { ENDPOINTS } from "@/constants";

function parseMeResponse(data: unknown): User {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid session payload");
  }

  const obj = data as Record<string, unknown>;
  const raw = (
    obj.user && typeof obj.user === "object"
      ? (obj.user as Record<string, unknown>)
      : obj
  ) as Record<string, unknown>;

  const rawId = raw.id ?? raw.userId;
  const idNum = typeof rawId === "number" ? rawId : Number(rawId);
  if (!Number.isFinite(idNum)) {
    throw new Error("Invalid session payload");
  }

  const email = typeof raw.email === "string" ? raw.email : "";
  const name =
    typeof raw.name === "string"
      ? raw.name
      : typeof raw.firstName === "string"
        ? [raw.firstName, typeof raw.lastName === "string" ? raw.lastName : ""]
            .filter(Boolean)
            .join(" ")
        : "";

  const nameParts = name.trim().length ? name.trim().split(/\s+/) : [];

  const firstName =
    (typeof raw.firstName === "string" ? raw.firstName : undefined) ??
    nameParts[0] ??
    (email ? email.split("@")[0] : "User");

  const lastName =
    (typeof raw.lastName === "string" ? raw.lastName : undefined) ??
    nameParts.slice(1).join(" ");

  const roleRaw = typeof raw.role === "string" ? raw.role.toUpperCase() : "";
  const role = roleRaw === "ADMIN" ? "ADMIN" : "USER";

  return {
    id: idNum,
    email,
    firstName,
    lastName,
    role,
  };
}

/**
 * Validates the HttpOnly session by calling the API (cookies sent via withCredentials).
 * No tokens or auth data are read from localStorage/sessionStorage.
 */
export const fetchSession = createAsyncThunk("auth/fetchSession", async () => {
  const response = await axiosClient.get(ENDPOINTS.AUTH.ME);
  return parseMeResponse(response.data);
});

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  sessionStatus: "loading",
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Call after POST /auth/login succeeds; cookies are already set by the server. */
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.sessionStatus = "authenticated";
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionStatus = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        if (!state.isAuthenticated) {
          state.sessionStatus = "loading";
        }
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionStatus = "authenticated";
      })
      .addCase(fetchSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionStatus = "unauthenticated";
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
