import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";
import type { Loan, Reservation, LoansState } from "@/types";
import { ENDPOINTS } from "@/constants";

type LoanResponse = {
  loans: Loan[];
  reservations: Reservation[];
};

export const fetchMyLoans = createAsyncThunk<LoanResponse>(
  "loans/fetchMyLoans",
  async () => {
    const [loansRes, reservationsRes] = await Promise.all([
      axiosClient.get(ENDPOINTS.LOANS.MY_LOANS),
      axiosClient.get("/loans/my-reservations"),
    ]);

    return {
      loans: Array.isArray(loansRes.data) ? loansRes.data : [],
      reservations: Array.isArray(reservationsRes.data)
        ? reservationsRes.data
        : [],
    };
  },
);

const initialState: LoansState = {
  loans: [],
  reservations: [],
  status: "idle",
  error: null,
};

export const reserveBook = createAsyncThunk(
  "loans/reserveBook",
  async ({ bookId, notes }: { bookId: number; notes: string }) => {
    const response = await axiosClient.post(ENDPOINTS.LOANS.RESERVE, {
      bookId,
      notes,
    });
    return response.data;
  },
);

export const loanBook = createAsyncThunk(
  "loans/loanBook",
  async ({ bookId, notes }: { bookId: number; notes: string }) => {
    console.log("Loaning book with ID:", bookId, "and notes:", notes);
    const response = await axiosClient.post(ENDPOINTS.LOANS.LOAN, {
      bookId,
      notes,
    });
    console.log("Loan response:", response.data);
    return response.data;
  },
);

export const returnBook = createAsyncThunk(
  "loans/returnBook",
  async (loanId: number) => {
    const response = await axiosClient.patch(ENDPOINTS.LOANS.RETURN(loanId));
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
