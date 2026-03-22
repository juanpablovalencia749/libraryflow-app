import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

export interface LogEntry {
  id: number;
  userId: number | null;
  entityName: string;
  entityId: number | null;
  action: string;
  description: string;
  beforeData: any | null;
  afterData: any | null;
  ipAddress: string | null;
  createdAt: string;
}

interface LoggerResponse {
  data: LogEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface LoggerState {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LoggerState = {
  logs: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  status: "idle",
  error: null,
};

export const fetchLogs = createAsyncThunk(
  "logger/fetchLogs",
  async (params?: { page?: number; limit?: number }) => {
    // If we use limit/offset, we might need to map them.
    // However, typical NestJS APIs with pagination use page/limit.
    // The user mentioned limit/offset specifically.
    const { page = 1, limit = 20 } = params || {};
    const offset = (page - 1) * limit;
    
    const response = await axiosClient.get("/logger", { 
      params: { limit, offset } 
    });

    // Handle both array and paginated response
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: {
          total: response.data.length,
          page: page,
          limit: limit,
          totalPages: 1,
        },
      };
    }
    
    return response.data as LoggerResponse;
  }
);

const loggerSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload.data;
        if (action.payload.meta) {
          state.total = action.payload.meta.total;
          state.page = action.payload.meta.page;
          state.limit = action.payload.meta.limit;
          state.totalPages = action.payload.meta.totalPages || Math.ceil(action.payload.meta.total / action.payload.meta.limit);
        }
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch logs";
      });
  },
});

export const { setPage } = loggerSlice.actions;
export default loggerSlice.reducer;
