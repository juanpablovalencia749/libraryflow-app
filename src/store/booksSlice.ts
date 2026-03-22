import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";
import type { Book, PaginatedResponse, BooksState } from "@/types";
import { ENDPOINTS } from "@/constants";

const initialState: BooksState = {
  books: [],
  selectedBook: null,
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
    const response = await axiosClient.get(ENDPOINTS.BOOKS.BASE, { params });
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
    return response.data as PaginatedResponse<Book>;
  },
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id: number) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKS.BY_ID(id));
    return response.data;
  },
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (newBook: Omit<Book, "id" | "createdAt">) => {
    const response = await axiosClient.post(ENDPOINTS.BOOKS.BASE, newBook);
    return response.data;
  },
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, data }: { id: number; data: Partial<Book> }) => {
    const response = await axiosClient.patch(ENDPOINTS.BOOKS.BY_ID(id), data);
    return response.data;
  },
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: number) => {
    await axiosClient.delete(ENDPOINTS.BOOKS.BY_ID(id));
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
      .addCase(fetchBookById.pending, (state) => {
        state.status = "loading";
        state.selectedBook = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch book";
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
