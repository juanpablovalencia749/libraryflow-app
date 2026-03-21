import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

type LoanResponse = {
  loans: any[];
  reservations: any[];
};

export const fetchMyLoans = createAsyncThunk<LoanResponse>(
  "loans/fetchMyLoans",
  async () => {
    const [loansRes, reservationsRes] = await Promise.all([
      axiosClient.get("/loans/my-loans"),
      axiosClient.get("/loans/my-reservations"),
    ]);

    console.log("fetchMyLoans loans:", loansRes.data);
    console.log("fetchMyLoans reservations:", reservationsRes.data);

    return {
      loans: Array.isArray(loansRes.data)
        ? loansRes.data
        : loansRes.data
          ? [loansRes.data]
          : [],
      reservations: Array.isArray(reservationsRes.data)
        ? reservationsRes.data
        : reservationsRes.data
          ? [reservationsRes.data]
          : [],
    };
  },
);

interface LoanState {
  loans: any[];
  reservations: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LoanState = {
  loans: [],
  reservations: [],
  status: "idle",
  error: null,
};

export const reserveBook = createAsyncThunk(
  "loans/reserveBook",
  async ({ bookId, notes }: { bookId: number; notes: string }) => {
    const response = await axiosClient.post("/loans/reserve", {
      bookId,
      notes,
    });
    return response.data;
  },
);

export const loanBook = createAsyncThunk(
  "loans/loanBook",
  async ({ bookId, notes }: { bookId: number; notes: string }) => {
    const response = await axiosClient.post("/loans/loan", { bookId, notes });
    return response.data;
  },
);

export const returnBook = createAsyncThunk(
  "loans/returnBook",
  async (loanId: number) => {
    const response = await axiosClient.patch(`/loans/return/${loanId}`);
    return response.data;
  },
);

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reserveBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(reserveBook.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(reserveBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Reserve failed";
      })
      .addCase(loanBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loanBook.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loanBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Loan failed";
      })
      .addCase(returnBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(returnBook.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Return failed";
      })
      .addCase(fetchMyLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans = action.payload.loans;
        state.reservations = action.payload.reservations;
      })
      .addCase(fetchMyLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch your loans";
      });
  },
});

export default loansSlice.reducer;
