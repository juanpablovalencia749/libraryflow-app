import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl?: string;
  publicationYear: number;
  status: "AVAILABLE" | "RESERVED" | "LOANED";
  reservationCount?: number;
  hasMyReservation?: boolean;
  myQueuePosition?: number | null;
  nextQueuePositionIfReserveNow?: number;
  borrowedByMe?: boolean;
  createdAt?: string;
}

interface BooksResponse {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface BooksState {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    title?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }) => {
    const response = await axiosClient.get("/books", { params });
    // Assume backend returns { data: [], meta: {...} } or just [] if no pagination setup.
    // If backend returns just an array, we map it to response.data
    // I will assume it returns { data, meta } based on typical paginated APIs.
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: {
          total: response.data.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };
    }
    return response.data as BooksResponse;
  },
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (newBook: Omit<Book, "id" | "createdAt">) => {
    const response = await axiosClient.post("/books", newBook);
    return response.data;
  },
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, data }: { id: number; data: Partial<Book> }) => {
    const response = await axiosClient.patch(`/books/${id}`, data);
    return response.data;
  },
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: number) => {
    await axiosClient.delete(`/books/${id}`);
    return id;
  },
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload.data;
        if (action.payload.meta) {
          state.total = action.payload.meta.total;
          state.page = action.payload.meta.page;
          state.limit = action.payload.meta.limit;
          state.totalPages = action.payload.meta.totalPages;
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch books";
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b.id !== action.payload);
      });
  },
});

export default booksSlice.reducer;
