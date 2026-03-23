import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBooks } from "../useBooks";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../../store/booksSlice";
import React from "react";

// Mock the dispatch
const mockDispatch = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) =>
      selector({
        books: {
          books: [],
          status: "idle",
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          error: null,
        },
        auth: {
          isAuthenticated: false,
          user: null,
          sessionStatus: "unauthenticated",
          status: "idle",
          error: null,
        },
      }),
  };
});

describe("useBooks Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const store = configureStore({ reducer: { books: booksReducer } });
    return <Provider store={store}>{children}</Provider>;
  };

  it("initially dispatches fetchBooks", async () => {
    renderHook(() => useBooks(), { wrapper });

    // Check if dispatch was called at least once (for fetchBooks)
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("returns the correct initial status", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.books).toEqual([]);
  });
});
